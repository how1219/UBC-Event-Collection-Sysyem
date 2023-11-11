const express = require('express');
const router = express.Router();
const EventsController = require('../controllers/eventsController');

// Existing GET route for fetching all events
router.get('/events', EventsController.getAllEvents);

// POST route for creating a new event
router.post('/events', EventsController.addEventController);

// PUT route for updating an existing event
router.put('/events/:id', EventsController.updateEventController);

// DELETE route for deleting an existing event
router.delete('/events/:id', EventsController.deleteEventController);


module.exports = router;
