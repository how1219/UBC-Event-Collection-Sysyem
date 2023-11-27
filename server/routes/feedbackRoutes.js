const express = require('express');
const router = express();
const FeedBackController = require('../controllers/feedbackController');

// Existing GET route for fetching all feedbacks
router.get('/feedback', FeedBackController.getAllFeedBacks);

// POST route for creating a new feedback
router.post('/feedback', FeedBackController.addFeedBackController);

// PUT route for updating an existing feedback
router.put('/feedback/:id', FeedBackController.updateFeedBackController);

// DELETE route for deleting an existing feedback
router.delete('/feedback/:id', FeedBackController.deleteFeedBackController);


module.exports = router;