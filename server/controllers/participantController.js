const participantModel = require('../models/participantModel');

async function getAllParticipants(req, res) {
    try {
        const participants = await participantModel.getAllParticipants();
        res.status(200).json({ data: participants });
    } catch (error) {
        console.error('Error in getAllParticipants controller:', error);
        res.status(500).json({ error: error.message });
    }
}