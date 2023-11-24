const express = require('express');
const router = express.Router();
const ParticipantController = require('../controllers/participantController');

// Existing GET route for fetching all events
router.get('/participant', ParticipantController.getAllParticipants());

// POST route for creating a new event
router.post('/participant', ParticipantController.addParticipantController());

// PUT route for updating an existing event
router.put('/participant/:id', ParticipantController.updateParticipantController());

// DELETE route for deleting an existing event
router.delete('/participant/:id', ParticipantController.deleteParticipantController());


module.exports = router;