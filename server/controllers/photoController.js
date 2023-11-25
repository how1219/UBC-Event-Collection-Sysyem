const PhotoModel = require('../models/photoModel');

async function getAllPhotos(req, res) {
    try {
        const photos = await PhotoModel.getAllPhotos();
        res.status(200).json({ data: photos });
    } catch (error) {
        console.error('Error in getAllPhotos controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function addPhotoController(req, res) {
    const photoDetails = req.body;
    const result = await EventsModel.addPhoto(photoDetails);
    if (result.success) {
        res.status(201).json({message: 'Photo created successfully.'});
    } else {
        res.status(500).json(result.error);
    }
}

async function updatePhotoController(req, res) {
    const photoID = req.params.id;
    const updateFields = req.body;
    const result = await PhotoModel.updatePhoto(photoID, updateFields);
    console.log(result);
    if (result.rowsAffected > 0) {
        res.status(201).json({message: 'Photo updated successfully.'});
    } else {
        res.status(500).json(result.error);
    }
}

async function deletePhotoController(req, res) {
    const photoID = req.params.id;
    const result = await PhotoModel.deletePhoto(photoID);
    console.log(result);
    if (result.rowsAffected > 0) {
        res.status(201).json({message: 'Photo deleted successfully.'});
    } else {
        res.status(500).json(result.error);
    }
}



module.exports = { getAllPhotos, addPhotoController, updatePhotoController, deletePhotoController};