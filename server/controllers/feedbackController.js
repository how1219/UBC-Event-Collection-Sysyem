const feedbackModel = require('../models/feedbackModel');

async function getAllFeedBacks(req, res) {
    try {
        const feedBacks = await feedbackModel.getAllFeedbacks();
        res.status(200).json({ data: feedBacks });
    } catch (error) {
        console.error('Error in getAllFeedBacks controller:', error);
        res.status(500).json({ error: error.message });
    }
}