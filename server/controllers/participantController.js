const ParticipantModel = require('../models/participantModel');

async function getAllParticipants(req, res) {
    try {
        const participants = await ParticipantModel.getAllParticipants();
        res.status(200).json({ data: participants });
    } catch (error) {
        console.error('Error in getAllParticipants controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function addParticipantController(req, res) {
    const participantDetail = req.body;
    const result = await ParticipantModel.addParticipant(participantDetail);
    if (result.success) {
        res.status(201).json({message: 'Participant created successfully.'});
    } else {
        res.status(500).json(result.error);
    }
}

async function updateParticipantController(req, res) {
    const participantID = req.params.id;
    const updateFields = req.body;
    const result = await ParticipantModel.updateParticipant(participantID, updateFields);
    console.log(result);
    if (result.rowsAffected > 0) {
        res.status(201).json({message: 'Participant updated successfully.'});
    } else {
        res.status(500).json(result.error);
    }
}

async function deleteParticipantController(req, res) {
    const participantID = req.params.id;
    const result = await ParticipantModel.deleteParticipant(participantID);
    console.log(result);
    if (result.rowsAffected > 0) {
        res.status(201).json({message: 'Participant deleted successfully.'});
    } else {
        res.status(500).json(result.error);
    }
}



module.exports = { getAllParticipants, addParticipantController, updateParticipantController, deleteParticipantController};