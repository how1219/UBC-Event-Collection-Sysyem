const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');

console.log(dbConfig);

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

async function addEvent(eventDetails) {
  try {
    const result = await withOracleDB(async (connection) => {
      const { EventID, OrganizerID, EventDate, Expense, EventTime, EventName } = eventDetails;
      const result = await connection.execute(
        `INSERT INTO EVENT (EventID, OrganizerID, EventDate, Expense, EventTime, EventName)
         VALUES (:EventID, :OrganizerID, TO_DATE(:EventDate, 'YYYY-MM-DD HH24:MI:SS'), :Expense, :EventTime, :EventName)`,
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




module.exports = { getAllEvents, addEvent, updateEvent, deleteEvent};