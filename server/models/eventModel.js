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

async function addEvent(eventDetails) {
  try {
    const result = await withOracleDB(async (connection) => {
      const { EventID, OrganizerID, EventDate, Expense, EventTime, EventName } = eventDetails;
      const result = await connection.execute(
        `INSERT INTO EVENT (EventID, OrganizerID, EventDate, Expense, EventTime, EventName)
         VALUES (:EventID, :OrganizerID, TO_TIMESTAMP(:EventDate, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"'), :Expense, :EventTime, :EventName)`,
        [EventID, OrganizerID, EventDate, Expense, EventTime, EventName],
        { autoCommit: true }
      );
      return result;
    });
    return { success: true, result };
  } catch (error) {
    console.error('Error adding event:', error);
    return { success: false, error };
  }
}

// For EventDate, using "YYYY-MM-DD HH24:MI:SS" format
async function updateEvent(eventID, updateFields) {
    try {
        return await withOracleDB(async (connection) => {
            const setParts = Object.keys(updateFields).map((key) => `${key} = :${key}`);
            const sqlQuery = `UPDATE EVENT SET ${setParts.join(', ')} WHERE EventID = :EventID`;
            const bindParams = { ...updateFields, EventID: eventID };
            const result = await connection.execute(sqlQuery, bindParams, { autoCommit: true });

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




module.exports = { getAllEvents, addEvent, updateEvent, deleteEvent, getEventSummaries};