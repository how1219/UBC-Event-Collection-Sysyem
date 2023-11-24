const express = require('express');
const router = express.Router();
const FeedBackController = require('../controllers/feedbackController');

// Existing GET route for fetching all feedbacks
router.get('/feedback', FeedBackController.getAllFeedBacks());

// POST route for creating a new event
router.post('/feedback', FeedBackController.addFeedBackController());

// PUT route for updating an existing event
router.put('/feedback/:eventID/:comment', FeedBackController.updateFeedBackController());

// DELETE route for deleting an existing event
router.delete('/feedback/:eventID/:comment', FeedBackController.deleteFeedBackController());


module.exports = router;