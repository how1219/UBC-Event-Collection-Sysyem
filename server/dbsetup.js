const oracledb = require('oracledb');
const loadEnvFile = require('../utils/envUtil');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    const envVariables = loadEnvFile('./.env');
    const dbConfig = {
      user: envVariables.ORACLE_USER,
      password: envVariables.ORACLE_PASS,
      connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`
    };

    let connection = await oracledb.getConnection(dbConfig);
    console.log('Connected to the Oracle database.');


    const tablesToDrop = [
      'EVENT_AND_LOCATION',
      'LOCATION',
      'ATTENDANCE',
      'PARTICIPANT',
      'EVENT_PHOTO',
      'FEEDBACK',
      'SPONSOR_SUPPORT',
      'SPONSOR',
      'VOLUNTEER',
      'PHOTOGRAPHER',
      'SPEAKER',
      'TEAM_MEMBER',
      'EVENT',
      'ORGANIZER'
    ];

    for (const table of tablesToDrop) {
      try {
        await connection.execute(`DROP TABLE ${table} CASCADE CONSTRAINTS`);
        console.log(`Dropped table: ${table}`);
      } catch (error) {
        if (error.errorNum === 942) { // ORA-00942: table or view does not exist
          console.log(`Table ${table} does not exist, skipping...`);
        } else {
          throw error;
        }
      }
    }

    console.log('Dropped existing tables.');


    // Read the SQL script
    const sqlScript = fs.readFileSync(path.join(__dirname, 'setup_data.sql'), 'utf8');
    const sqlStatements = sqlScript.split(';');

    for (const statement of sqlStatements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }

    console.log('Database setup with sample data completed.');


    // Commit the transaction
    await connection.commit();

    await connection.close();
    console.log('Database setup completed.');
    console.log('Database setup with sample data completed.');
  } catch (error) {
    console.error('Error setting up the database:', error);
    await connection.rollback();
    process.exit(1);
  }
}

module.exports = setupDatabase;
