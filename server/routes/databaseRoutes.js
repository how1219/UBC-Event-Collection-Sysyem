const express = require('express');
const router = express.Router();
const DatabaseController = require('../controllers/databaseController');

// GET tables
router.get('/tables', DatabaseController.getDatabaseTables);

// Get attributes in a table
router.get('/tables/:tableName/attributes', DatabaseController.getTableAttributes);

router.get('/customized-table', DatabaseController.executeDynamicProjectionQuery);

module.exports = router;
