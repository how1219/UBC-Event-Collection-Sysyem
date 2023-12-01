const express = require('express');
const router = express.Router();
const EventsController = require('../controllers/eventController');

// Existing GET route for fetching all events
router.get('/event', EventsController.getAllEvents);

//GET events by organizer nnd event name
router.get('/event/search', EventsController.getEventsByOrganizerAndName);

// Existing GET route for fetching event detail by id
router.get('/event/:id', EventsController.getEventByIdController);

// GET all event summaries
router.get('/eventSummaries', EventsController.getEventSummaries);

// POST route for creating a new event
router.post('/event', EventsController.addEventController);

// PUT route for updating an existing event
router.put('/event/:id', EventsController.updateEventController);

// DELETE route for deleting an existing event
router.delete('/event/:id', EventsController.deleteEventController);


router.get('/event/high-rated-detailed/:ratingThreshold', EventsController.getHighRatedEventsDetailed);




module.exports = router;
