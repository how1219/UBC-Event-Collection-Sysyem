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

async function getAllFeedbacks() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM FEEDBACK');
        return result.rows.map(row => {
            const [FeedbackID, EventID, Rating, Feedback] = row;
            return {
                FeedbackID,
                EventID,
                Rating,
                Feedback
            };
        });
    }).catch(() => {
        return [];
    });
}

async function addFeedBack(feedBackDetails) {
    try {
        const result = await withOracleDB(async (connection) => {
            const { FeedbackID, EventID, Rating, Feedback } = feedBackDetails;
            const result = await connection.execute(
                `INSERT INTO FEEDBACK (FeedbackID, EventID, Rating, Feedback)
         VALUES (:FeedbackID, :EventID, :Rating, :Feedback)`,
                [FeedbackID, EventID, Rating, Feedback],
                { autoCommit: true }
            );
            return result;
        });
        return { success: true, result };
    } catch (error) {
        console.error('Error adding feedback:', error);
        return { success: false, error };
    }
}

async function updateFeedBack(feedbackID, updateFields) {
    try {
        return await withOracleDB(async (connection) => {
            const setParts = Object.keys(updateFields).map((key) => `${key} = :${key}`);
            const sqlQuery = `UPDATE FEEDBACK SET ${setParts.join(', ')} WHERE FeedbackID = :feedbackID`;
            const bindParams = { ...updateFields, FeedbackID: feedbackID };
            const result = await connection.execute(sqlQuery, bindParams, { autoCommit: true });

            return result;
        });
    } catch (error) {
        console.error('Error updating feedback:', error);
        throw error;
    }
}

async function deleteFeedBack(feedBackID) {
    try {
        return await withOracleDB(async (connection) => {
            const sqlQuery = 'DELETE FROM FEEDBACK WHERE FeedbackID = :feedBackID';
            const result = await connection.execute(sqlQuery, [feedBackID], { autoCommit: true });
            return result;
        });
    } catch (error) {
        if (error.message.includes('ORA-02292')) {
            console.error('Error deleting feedback:', error);
            return {
                success: false,
                message: 'Cannot delete feedback because there are related records that must be deleted first.',
                error: error
            };
        } else {
            console.error('Error deleting feedback:', error);
            throw error;
        }
    }
}

module.exports = {getAllFeedbacks, addFeedBack, updateFeedBack, deleteFeedBack};
