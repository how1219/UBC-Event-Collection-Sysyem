const FeedBackModel = require('../models/feedbackModel');

async function getAllFeedBacks(req, res) {
    try {
        const feedbacks = await FeedBackModel.getAllFeedbacks();
        res.status(200).json({ data: feedbacks });
    } catch (error) {
        console.error('Error in getAllFeedBacks controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function addFeedBackController(req, res) {
    try {
        const feedBackDetails = req.body;
        const result = await FeedBackModel.addFeedBack(feedBackDetails);
        if (result.success) {
            res.status(201).json({message: 'Feedback created successfully.'});
        } else {
            res.status(500).json(result.error);
        }
    } catch (error) {
        console.error('Error in addFeedBackController:', error);
        res.status(500).json({ error: error.message });
    }
}

async function updateFeedBackController(req, res) {
    try {
        const feedBackID = req.params.id;
        const updateFields = req.body;
        const result = await FeedBackModel.updateFeedBack(feedBackID, updateFields);
        console.log(result);
        if (result.rowsAffected > 0) {
            res.status(201).json({message: 'Feedback updated successfully.'});
        } else {
            res.status(500).json(result.error);
        }
    } catch (error) {
        console.error('Error in updateFeedBackController:', error);
        res.status(500).json({ error: error.message });
    }

}

async function deleteFeedBackController(req, res) {
    try {
        const feedBackID = req.params.id;
        const result = await FeedBackModel.deleteFeedBack(feedBackID);
        console.log(result);
        if (result.rowsAffected > 0) {
            res.status(201).json({message: 'Feedback deleted successfully.'});
        } else {
            res.status(500).json(result.error);
        }
    } catch (error) {
        console.error('Error in deleteFeedBackController:', error);
        res.status(500).json({ error: error.message });
    }

}

module.exports = {getAllFeedBacks, addFeedBackController, updateFeedBackController, deleteFeedBackController};


