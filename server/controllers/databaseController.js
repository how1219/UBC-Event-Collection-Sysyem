const DatabaseModel = require('../models/databaseModel');

async function getDatabaseTables(req, res) {
    try {
        const tableNames = await DatabaseModel.getDatabaseTables();
        res.status(200).json({data: tableNames});

    } catch(error) {
        console.error('Error in getDatabaseTables controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getTableAttributes(req, res) {
    try {
        const tableName = req.params.tableName.toUpperCase();
        const attributes = await DatabaseModel.getTableAttributes(tableName);
        res.status(200).json({data: attributes});

    } catch(error) {
        console.error('Error in getTableAttributes controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function executeDynamicProjectionQuery(req, res) {
    try {
        const tableName = req.query.tableName;
        const selectedAttributes = req.query.selectedAttributes.split(',');

        // Validate tableName and selectedAttributes

        const results = await DatabaseModel.executeDynamicProjectionQuery(tableName, selectedAttributes);
        res.json({ data: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {getDatabaseTables, getTableAttributes, executeDynamicProjectionQuery};