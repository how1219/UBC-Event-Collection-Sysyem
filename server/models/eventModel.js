const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function getAllEvents() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM EVENT');
        return result.rows.map(row => {
            const [EventID, OrganizerID, EventDate, Expense, EventTime, EventName] = row;
            return {
                EventID,
                OrganizerID,
                EventDate: new Date(EventDate).toISOString(),
                Expense,
                EventTime,
                EventName
            };
        });
    }).catch(() => {
        return [];
    });
}


async function getEventById(eventId) {
    try {
        return await withOracleDB(async (connection) => {
            const sqlQuery = 'SELECT * FROM EVENT WHERE EventID = :EventID';
            const binds = { EventID: eventId };
            const result = await connection.execute(sqlQuery, binds);

            if (result.rows.length === 0) {
                return null;
            }

            const eventRow = result.rows[0];
            return {
                EventID: eventRow[0],
                OrganizerID: eventRow[1],
                EventDate: eventRow[2].toISOString(),
                Expense: eventRow[3],
                EventTime: eventRow[4],
                EventName: eventRow[5]
            };
        });
    } catch (error) {
        console.error('Error getting event by ID:', error);
        throw error;
    }
}



async function getEventSummaries(filters) {
    return await withOracleDB(async (connection) => {
        let query = `
            SELECT E.EventID, E.EventName, E.EventDate, E.EventTime, O.OrganizerName, AVG(F.Rating) AS AverageRating
            FROM EVENT E
            LEFT JOIN ORGANIZER O ON E.OrganizerID = O.OrganizerID
            LEFT JOIN FEEDBACK F ON E.EventID = F.EventID
        `;
        let conditions = [];
        let havingConditions = [];

        // filters
        if (filters.minAverageRating) {
            havingConditions.push(`AVG(F.Rating) >= ${filters.minAverageRating}`);
        }
        if (filters.organizerId) {
            conditions.push(`E.OrganizerID = ${filters.organizerId}`);
        }
        if (filters.eventName) {
            conditions.push(`UPPER(E.EventName) LIKE UPPER('%${filters.eventName}%')`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(' AND ');
        }

        query += ` GROUP BY E.EventID, E.EventName, E.EventDate, E.EventTime, O.OrganizerName`;

        if (havingConditions.length > 0) {
            query += ` HAVING ` + havingConditions.join(' AND ');
        }

        console.log("SQL Query:", query);

        const result = await connection.execute(query);
        return result.rows.map(row => {
            const [EventID, EventName, EventDate, EventTime, OrganizerName, AverageRating] = row;
            return {
                EventID,
                EventName,
                EventDate: new Date(EventDate).toISOString(),
                EventTime,
                OrganizerName,
                AverageRating: AverageRating ? parseFloat(AverageRating).toFixed(1) : null
            };
        });
    }).catch(() => {
        return [];
    });
}

async function getHighRatedEventsDetailed(ratingThreshold) {
    return await withOracleDB(async (connection) => {
        const query = `
            SELECT E.*, AVG(F.Rating) AS AverageRating
            FROM EVENT E
            JOIN FEEDBACK F ON E.EventID = F.EventID
            GROUP BY E.EventID, E.OrganizerID, E.EventDate, E.Expense, E.EventTime, E.EventName
            HAVING AVG(F.Rating) > :ratingThreshold
        `;
        console.log(query);
        const result = await connection.execute(query, [ratingThreshold]);
        return result.rows.map(row => {
            const [EventID, OrganizerID, EventDate, Expense, EventTime, EventName, AverageRating] = row;
            return {
                EventID,
                OrganizerID,
                EventDate: EventDate ? new Date(EventDate).toISOString() : null,
                Expense,
                EventTime,
                EventName,
                AverageRating: AverageRating ? parseFloat(AverageRating).toFixed(1) : null
            };
        });
    }).catch(error => {
        console.error('Error fetching high rated events:', error);
        return [];
    });
}

async function getEventsByOrganizerAndName(organizerId, eventName) {
    return await withOracleDB(async (connection) => {
        let query = `SELECT * FROM EVENT WHERE 1=1`;
        const params = {};

        if (organizerId) {
            query += ` AND OrganizerID = :organizerId`;
            params.organizerId = parseInt(organizerId);
        }
        if (eventName) {
            query += ` AND UPPER(EventName) LIKE UPPER(:eventName)`;
            params.eventName = `%${eventName}%`;
        }

        console.log(query);
        const result = await connection.execute(query, params);
        return result.rows.map(row => {
            const [EventID, OrganizerID, EventDate, Expense, EventTime, EventName] = row;
            return {
                EventID,
                OrganizerID,
                EventDate: new Date(EventDate).toISOString(),
                Expense,
                EventTime,
                EventName
            };
        });
    }).catch(error => {
        console.error('Error fetching events:', error);
        return [];
    });
}

async function addEvent(eventDetails) {
    try {
        return await withOracleDB(async (connection) => {
            const { EventID, OrganizerID, EventDate, Expense, EventTime, EventName } = eventDetails;

            // Input validation
            if (!EventID || !OrganizerID || !EventDate || !EventTime || !EventName) {
                return { success: false, error: 'Missing required event details.' };
            }
            if (!Number.isInteger(EventID) || !Number.isInteger(OrganizerID)) {
                return { success: false, error: 'Invalid EventID or OrganizerID. Must be integers.' };
            }
            if (typeof Expense !== 'number') {
                return { success: false, error: 'Invalid Expense. Must be a number.' };
            }
            // Validate EventDate (format: YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(EventDate)) {
                return { success: false, error: 'Invalid EventDate format. Expected format: YYYY-MM-DD.' };
            }
            // Validate EventTime (format: HH:MM)
            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
            if (!timeRegex.test(EventTime)) {
                return { success: false, error: 'Invalid EventTime format. Expected format: HH:MM.' };
            }
            // EventName length validation (max 50 characters)
            if (EventName.length > 50) {
                return { success: false, error: 'EventName too long. Maximum 50 characters allowed.' };
            }

            // Check if OrganizerID exists
            const checkOrganizer = await connection.execute(
                `SELECT COUNT(*) AS count FROM ORGANIZER WHERE OrganizerID = :OrganizerID`,
                [OrganizerID]
            );
            if (checkOrganizer.rows[0][0] === 0) {
                // OrganizerID does not exist
                return { success: false, error: 'OrganizerID does not exist.' };
            }

            // Check for duplicate EventID
            const checkEvent = await connection.execute(
                `SELECT COUNT(*) AS count FROM EVENT WHERE EventID = :EventID`,
                [EventID]
            );
            if (checkEvent.rows[0][0] > 0) {
                return { success: false, error: 'Duplicate EventID. Event already exists.' };
            }

            // Parameterized queries ensure that user input is treated strictly as data and not as part of the SQL command.
            await connection.execute(
                `INSERT INTO EVENT (EventID, OrganizerID, EventDate, Expense, EventTime, EventName)
                 VALUES (:EventID, :OrganizerID, TO_TIMESTAMP(:EventDate, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"'), :Expense, :EventTime, :EventName)`,
                [EventID, OrganizerID, EventDate, Expense, EventTime, EventName],
                { autoCommit: true }
            );
            return { success: true };
        });
    } catch (error) {
        console.error('Error adding event:', error);
        return { success: false, error: error.message };
    }
}


// For EventDate, using "YYYY-MM-DD" format
async function updateEvent(eventID, updateFields) {
    try {
        // Check if there are fields to update
        if (Object.keys(updateFields).length === 0) {
            throw new Error('No update fields provided.');
        }

        // Validate and process each field
        for (const key in updateFields) {
            if (key !== 'EventDate') {
                switch (key) {
                    case 'OrganizerID':
                        if (!Number.isInteger(updateFields.OrganizerID)) {
                            throw new Error('Invalid OrganizerID. Must be an integer.');
                        }
                        break;
                    case 'EventDate':
                        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                        if (!dateRegex.test(updateFields.EventDate)) {
                            throw new Error('Invalid EventDate format. Expected format: YYYY-MM-DD.');
                        }
                        // Convert the EventDate to a timestamp format
                        updateFields.EventDate = new Date(updateFields.EventDate).TO_TIMESTAMP;
                        break;
                    case 'Expense':
                        if (typeof updateFields.Expense !== 'number') {
                            throw new Error('Invalid Expense. Must be a number.');
                        }
                        break;
                    case 'EventTime':
                        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
                        if (!timeRegex.test(updateFields.EventTime)) {
                            throw new Error('Invalid EventTime format. Expected format: HH:MM.');
                        }
                        break;
                    case 'EventName':
                        if (typeof updateFields.EventName !== 'string' || updateFields.EventName.length > 50) {
                            throw new Error('Invalid EventName. Must be a string with a maximum of 50 characters.');
                        }
                        break;
                    default:
                        throw new Error(`Invalid field: ${key}`);
                }
            }
        }
        return await withOracleDB(async (connection) => {
            const setParts = Object.keys(updateFields).map((key) => {
                if (key === 'EventDate') {
                    return `${key} = TO_TIMESTAMP(:${key}, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"')`;
                } else {
                    return `${key} = :${key}`;
                }
            });
            const sqlQuery = `UPDATE EVENT SET ${setParts.join(', ')} WHERE EventID = :EventID`;
            const bindParams = { ...updateFields, EventID: eventID };
            const result = await connection.execute(sqlQuery, bindParams, { autoCommit: true });
            console.log(sqlQuery);

            return result;
        });
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
}

async function deleteEvent(eventID) {
    try {
        return await withOracleDB(async (connection) => {
            const sqlQuery = 'DELETE FROM EVENT WHERE EventID = :EventID';
            const result = await connection.execute(sqlQuery, [eventID], { autoCommit: true });
            return result;
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
}




module.exports = {
    getAllEvents, addEvent, updateEvent, deleteEvent, getEventSummaries, getHighRatedEventsDetailed, getEventsByOrganizerAndName,
    getEventById
};