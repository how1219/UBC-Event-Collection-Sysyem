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


    async function getAllSponsors() {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute('SELECT * FROM SPONSOR');
            return result.rows.map(row => {
                const [SponsorName, SponsorPhoneNo, SponsorEmail] = row;
                return {
                    SponsorName,
                    SponsorPhoneNo,
                    SponsorEmail
                };
            });
        }).catch(() => {
            return [];
        });
    }

async function getSponsorsWhoSupportedAllTypes() {
    return await withOracleDB(async (connection) => {
        const query = `
            SELECT S.SponsorName
            FROM SPONSOR S
            WHERE NOT EXISTS (
                SELECT DISTINCT SS1.SponsorshipType
                FROM SPONSOR_SUPPORT SS1
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM SPONSOR_SUPPORT SS2
                    WHERE SS2.SponsorName = S.SponsorName
                    AND SS2.SponsorPhoneNo = S.SponsorPhoneNo
                    AND SS2.SponsorshipType = SS1.SponsorshipType
                )
            )
        `;

        console.log("Executing query:", query);
        const result = await connection.execute(query);

        console.log("Query result:", result);
        return result.rows.map(row => {
            const [SponsorName] = row;
            return { SponsorName };
        });
    }).catch(error => {
        console.error('Error fetching sponsors who supported all types:', error);
        return [];
    });
}


    async function addSponsor(sponsorDetails) {
        try {
            const result = await withOracleDB(async (connection) => {
                const { SponsorName, SponsorPhoneNo, SponsorEmail } = sponsorDetails;
                const result = await connection.execute(
                    `INSERT INTO SPONSOR (SponsorName, SponsorPhoneNo, SponsorEmail)
         VALUES (:SponsorName,:SponsorPhoneNo,:SponsorEmail)`,
                    [SponsorName, SponsorPhoneNo, SponsorEmail],
                    { autoCommit: true }
                );
                return result;
            });
            return { success: true, result };
        } catch (error) {
            console.error('Error adding sponsor:', error);
            return { success: false, error };
        }
    }


    async function updateSponsor(sponsorName, sponsorPhoneNo, updateFields) {
        try {
            return await withOracleDB(async (connection) => {
                const setClauses = Object.keys(updateFields).map((key) => `${key} = :${key}`);
                const sqlQuery = `UPDATE SPONSOR SET ${setClauses.join(', ')} WHERE SponsorName = :sponsorName AND SponsorPhoneNo = :sponsorPhoneNo`;
                const bindParams = { ...updateFields, SponsorName: sponsorName, sponsorPhoneNo: sponsorPhoneNo };
                const result = await connection.execute(sqlQuery, bindParams, { autoCommit: true });

                return result;
            });
        } catch (error) {
            console.error('Error updating sponsor:', error);
            throw error;
        }
    }


    async function deleteSponsor(sponsorName, sponsorPhoneNo) {
        try {
            return await withOracleDB(async (connection) => {
                const sqlQuery = `DELETE FROM SPONSOR WHERE SponsorName = :sponsorName AND SponsorPhoneNo = :sponsorPhoneNo`;
                const bindParams = { SponsorName: sponsorName, SponsorPhoneNo: sponsorPhoneNo };
                const result = await connection.execute(sqlQuery, bindParams, { autoCommit: true });

                return result;
            });
        } catch (error) {
            console.error('Error deleting sponsor:', error);
            // Handle specific error types if necessary, or return a generic error message
            return { success: false, message: 'Failed to delete sponsor.', error: error };
        }
    }



    module.exports = {getAllSponsors, addSponsor, updateSponsor, deleteSponsor, getSponsorsWhoSupportedAllTypes};