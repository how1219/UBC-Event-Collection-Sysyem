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

async function getAllTeamMembers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM TEAM_MEMBER');
        return result.rows.map(row => {
            const [MemberName, MemberPhoneNo, OrganizerID, StaffEmail, PayRate] = row;
            return {
                MemberName,
                MemberPhoneNo,
                OrganizerID,
                StaffEmail,
                PayRate
            };
        });
    }).catch(() => {
        return [];
    });
}

async function addTeamMember(teamMemberDetails) {
  try {
    const result = await withOracleDB(async (connection) => {
      const { MemberName, MemberPhoneNo, OrganizerID, StaffEmail, PayRate } = teamMemberDetails;
      const result = await connection.execute(
        `INSERT INTO TEAM_MEMBER (MemberName, MemberPhoneNo, OrganizerID, StaffEmail, PayRate)
         VALUES (:MemberName, :MemberPhoneNo, :OrganizerID, :StaffEmail, :PayRate)`,
        [MemberName, MemberPhoneNo, OrganizerID, StaffEmail, PayRate],
        { autoCommit: true }
      );
      return result;
    });
    return { success: true, result };
  } catch (error) {
    console.error('Error adding team member:', error);
    return { success: false, error };
  }
}


async function updateTeamMember(memberName, memberPhoneNo, updateFields) {
    try {
        return await withOracleDB(async (connection) => {
            const setClauses = Object.keys(updateFields).map((key) => `${key} = :${key}`);
            const sqlQuery = `UPDATE TEAM_MEMBER SET ${setClauses.join(', ')} WHERE MemberName = :MemberName AND MemberPhoneNo = :MemberPhoneNo`;
            const bindParams = { ...updateFields, MemberName: memberName, MemberPhoneNo: memberPhoneNo };
            const result = await connection.execute(sqlQuery, bindParams, { autoCommit: true });

            return result;
        });
    } catch (error) {
        console.error('Error updating team member:', error);
        throw error;
    }
}


async function deleteTeamMember(memberName, memberPhoneNo) {
    try {
        return await withOracleDB(async (connection) => {
            const sqlQuery = `DELETE FROM TEAM_MEMBER WHERE MemberName = :MemberName AND MemberPhoneNo = :MemberPhoneNo`;
            const bindParams = { MemberName: memberName, MemberPhoneNo: memberPhoneNo };
            const result = await connection.execute(sqlQuery, bindParams, { autoCommit: true });

            return result;
        });
    } catch (error) {
        console.error('Error deleting team member:', error);
        // Handle specific error types if necessary, or return a generic error message
        return { success: false, message: 'Failed to delete team member.', error: error };
    }
}



module.exports = {getAllTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember};