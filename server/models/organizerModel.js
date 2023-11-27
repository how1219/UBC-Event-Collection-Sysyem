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

async function getAllOrganizers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM ORGANIZER');
        return result.rows.map(row => {
            const [OrganizerID, OrganizerName, OrganizerEmail, OrganizerPhoneNo] = row;
            return {
                OrganizerID,
                OrganizerName,
                OrganizerEmail,
                OrganizerPhoneNo
            };
        });
    }).catch(() => {
        return [];
    });
}

async function addOrganizer(organizerDetails) {
  try {
    const result = await withOracleDB(async (connection) => {
      const { OrganizerID, OrganizerName, OrganizerEmail, OrganizerPhoneNo } = organizerDetails;
      const result = await connection.execute(
        `INSERT INTO ORGANIZER (OrganizerID, OrganizerName, OrganizerEmail, OrganizerPhoneNo)
         VALUES (:OrganizerID, :OrganizerName, :OrganizerEmail, :OrganizerPhoneNo)`,
        [OrganizerID, OrganizerName, OrganizerEmail, OrganizerPhoneNo],
        { autoCommit: true }
      );
      return result;
    });
    return { success: true, result };
  } catch (error) {
    console.error('Error adding organizer:', error);
    return { success: false, error };
  }
}

async function updateOrganizer(organizerID, updateFields) {
    try {
        return await withOracleDB(async (connection) => {
            const setParts = Object.keys(updateFields).map((key) => `${key} = :${key}`);
            const sqlQuery = `UPDATE ORGANIZER SET ${setParts.join(', ')} WHERE OrganizerID = :organizerID`;
            const bindParams = { ...updateFields, OrganizerID: organizerID };
            const result = await connection.execute(sqlQuery, bindParams, { autoCommit: true });

            return result;
        });
    } catch (error) {
        console.error('Error updating organizer:', error);
        throw error;
    }
}

async function deleteOrganizer(organizerID) {
    try {
        return await withOracleDB(async (connection) => {
            const sqlQuery = 'DELETE FROM ORGANIZER WHERE OrganizerID = :organizerID';
            const result = await connection.execute(sqlQuery, [organizerID], { autoCommit: true });
            return result;
        });
    } catch (error) {
        if (error.message.includes('ORA-02292')) {
            console.error('Error deleting event:', error);
            return {
                success: false,
                message: 'Cannot delete event because there are related records that must be deleted first.',
                error: error
            };
        } else {
            console.error('Error deleting event:', error);
            throw error;
        }
    }
}



module.exports = {getAllOrganizers, addOrganizer, updateOrganizer, deleteOrganizer};