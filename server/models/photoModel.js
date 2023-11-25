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

async function getAllPhotos() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM EVENT_PHOTO');
        return result.rows.map(row => {
            const [PhotoID, EventID, Description] = row;
            return {
                PhotoID,
                EventID,
                Description
            };
        });
    }).catch(() => {
        return [];
    });
}

async function addPhoto(photoDetails) {
    try {
        const result = await withOracleDB(async (connection) => {
            const { PhotoID, EventID, Description } = photoDetails;
            const result = await connection.execute(
                `INSERT INTO ORGANIZER (PhotoID, EventID, Description)
         VALUES (:PhotoID, :EventID, :Description)`,
                [PhotoID, EventID, Description],
                { autoCommit: true }
            );
            return result;
        });
        return { success: true, result };
    } catch (error) {
        console.error('Error adding photo:', error);
        return { success: false, error };
    }
}

async function updatePhoto(photoID, updateFields) {
    try {
        return await withOracleDB(async (connection) => {
            const setParts = Object.keys(updateFields).map((key) => `${key} = :${key}`);
            const sqlQuery = `UPDATE EVENT_PHOTO SET ${setParts.join(', ')} WHERE PhotoID = :photoID`;
            const bindParams = { ...updateFields, PhotoID: photoID };
            const result = await connection.execute(sqlQuery, bindParams, { autoCommit: true });

            return result;
        });
    } catch (error) {
        console.error('Error updating photo:', error);
        throw error;
    }
}

async function deletePhoto(photoID) {
    try {
        return await withOracleDB(async (connection) => {
            const sqlQuery = 'DELETE FROM ORGANIZER WHERE PhotoID = :photoID';
            const result = await connection.execute(sqlQuery, [photoID], { autoCommit: true });
            return result;
        });
    } catch (error) {
        if (error.message.includes('ORA-02292')) {
            console.error('Error deleting photo:', error);
            return {
                success: false,
                message: 'Cannot delete photo because there are related records that must be deleted first.',
                error: error
            };
        } else {
            console.error('Error deleting photo:', error);
            throw error;
        }
    }
}



module.exports = {getAllPhotos, addPhoto, updatePhoto, deletePhoto};