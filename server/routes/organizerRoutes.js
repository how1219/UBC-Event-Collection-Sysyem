const express = require('express');
const router = express.Router();
const OrganizerController = require('../controllers/organizerController');


// Existing GET route for fetching all organizers
router.get('/organizer', OrganizerController.getAllOrganizers);

// POST route for creating a new organizer
router.post('/organizer', OrganizerController.addOrganizerController);

// PUT route for updating an existing organizer
router.put('/organizer/:id', OrganizerController.updateOrganizerController);

// DELETE route for deleting an existing organizer
router.delete('/organizer/:id', OrganizerController.deleteOrganizerController);

// Get the total number of events hosted by each organizer
router.get('/organizers/total-events', OrganizerController.getTotalEventsByOrganizers);

// Get the highest average rating among all organizers
router.get('/organizers/highest-average-rating', OrganizerController.getHighestAverageRating);

// Get all organizer contact detail
router.get('/organizers/contact-detail', OrganizerController.getOrganizerContactDetail);

module.exports = router;
