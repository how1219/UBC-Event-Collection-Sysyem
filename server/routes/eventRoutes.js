const express = require('express');
const router = express.Router();
const EventsController = require('../controllers/eventController');

// Existing GET route for fetching all events
router.get('/event', EventsController.getAllEvents);

// POST route for creating a new event
router.post('/event', EventsController.addEventController);

// PUT route for updating an existing event
router.put('/event/:id', EventsController.updateEventController);

// DELETE route for deleting an existing event
router.delete('/event/:id', EventsController.deleteEventController);


module.exports = router;
