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

async function getAllParticipants() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PARTICIPANT');
        return result.rows.map(row => {
            const [ParticipantID, ParticipantName, ParticipantEmail] = row;
            return {
                ParticipantID,
                ParticipantName,
                ParticipantEmail
            };
        });
    }).catch(() => {
        return [];
    });
}

async function addParticipant(participantDetails) {
    try {
        const result = await withOracleDB(async (connection) => {
            const { ParticipantID, ParticipantName, ParticipantEmail } = participantDetails;
            const result = await connection.execute(
                `INSERT INTO ORGANIZER (ParticipantID, ParticipantName, ParticipantEmail)
         VALUES (:ParticipantID, :ParticipantName, :ParticipantEmail)`,
                [ParticipantID, ParticipantName, ParticipantEmail],
                { autoCommit: true }
            );
            return result;
        });
        return { success: true, result };
    } catch (error) {
        console.error('Error adding participant:', error);
        return { success: false, error };
    }
}

async function updateParticipant(participantID, updateFields) {
    try {
        return await withOracleDB(async (connection) => {
            const setParts = Object.keys(updateFields).map((key) => `${key} = :${key}`);
            const sqlQuery = `UPDATE PARTICIPANT SET ${setParts.join(', ')} WHERE ParticipantID = :participantID`;
            const bindParams = { ...updateFields, ParticipantID: participantID };
            const result = await connection.execute(sqlQuery, bindParams, { autoCommit: true });

            return result;
        });
    } catch (error) {
        console.error('Error updating participant:', error);
        throw error;
    }
}

async function deleteParticipant(participantID) {
    try {
        return await withOracleDB(async (connection) => {
            const sqlQuery = 'DELETE FROM PARTICIPANT WHERE ParticipantID = :participantID';
            const result = await connection.execute(sqlQuery, [participantID], { autoCommit: true });
            return result;
        });
    } catch (error) {
        if (error.message.includes('ORA-02292')) {
            console.error('Error deleting participant:', error);
            return {
                success: false,
                message: 'Cannot delete participant because there are related records that must be deleted first.',
                error: error
            };
        } else {
            console.error('Error deleting participant:', error);
            throw error;
        }
    }
}



module.exports = {getAllParticipants, addParticipant, updateParticipant, deleteParticipant};