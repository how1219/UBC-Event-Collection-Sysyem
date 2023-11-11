const oracledb = require('oracledb');
const path = require('path');
const loadEnvFile = require('../../utils/envUtil');
const envVariables = loadEnvFile(path.join(__dirname, '../../.env'));


const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`
};


module.exports = dbConfig;