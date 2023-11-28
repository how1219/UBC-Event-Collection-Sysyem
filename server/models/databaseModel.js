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


async function getDatabaseTables() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT table_name FROM user_tables');
        return result.rows.map(row => row[0]);
    }).catch(() => {
        return [];
    });
}

async function getTableAttributes(tableName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT column_name FROM user_tab_columns WHERE table_name = :tableName',
        [tableName]
        );
        return result.rows.map(row => row[0]);
    }).catch(() => {
        return [];
    });
}


async function executeDynamicProjectionQuery(tableName, selectedAttributes) {
    return await withOracleDB(async (connection) => {
        const query = `SELECT ${selectedAttributes.join(', ')} FROM ${tableName}`;
        const result = await connection.execute(query);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

module.exports = { getDatabaseTables, getTableAttributes, executeDynamicProjectionQuery };