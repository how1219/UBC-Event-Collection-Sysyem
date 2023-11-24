const photoModel = require('../models/photoModel');

async function getAllPhotos(req, res) {
    try {
        const photos = await photoModel.getAllPhotos();
        res.status(200).json({ data: photos });
    } catch (error) {
        console.error('Error in getAllPhotos controller:', error);
        res.status(500).json({ error: error.message });
    }
}