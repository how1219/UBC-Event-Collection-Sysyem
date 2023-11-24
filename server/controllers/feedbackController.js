const FeedBackModel = require('../models/feedbackModel');

async function getAllFeedBacks(req, res) {
    try {
        const feedBacks = await FeedBackModel.getAllFeedbacks();
        res.status(200).json({ data: feedBacks });
    } catch (error) {
        console.error('Error in getAllFeedBacks controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function addFeedBackController(req, res) {
    try {
        const result = await FeedBackModel.addFeedBack(req.body);
        if (result.success) {
            res.status(201).json({ message: 'Feedback added successfully.', data: result.result });
        } else {
            res.status(400).json({ message: 'Could not add feedback.', error: result.error });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error occurred while adding a feedback.', error: error.toString() });
    }
}

async function updateFeedBackController(req, res) {
    const {eventID, comment } = req.params;
    try {
        const result = await FeedBackModel.updateFeedBack(eventID, comment, req.body);
        if (result.rowsAffected > 0) {
            res.status(200).json({ message: 'Feedback updated successfully.' });
        } else {
            res.status(404).json({ message: 'No feedback found with the given details.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error occurred while updating the feedback.', error: error.toString() });
    }
}

async function deleteFeedBackController(req, res) {
    const {eventID, comment } = req.params;
    try {
        const result = await FeedBackModel.deleteFeedBack(eventID, comment);
        if (result.rowsAffected > 0) {
            res.status(200).json({ message: 'Feedback deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Feedback not found or already deleted.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error occurred while deleting the feedback.', error: error.toString() });
    }
}



module.exports = { getAllFeedBacks, addFeedBackController, updateFeedBackController, deleteFeedBackController};