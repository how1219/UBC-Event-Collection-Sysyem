const express = require('express');
const router = express.Router();
const PhotoController = require('../controllers/photoController');

// Existing GET route for fetching all events
router.get('/Photo', PhotoController.getAllPhotos);

// POST route for creating a new event
router.post('/Photo', PhotoController.addPhotoController);

// PUT route for updating an existing event
router.put('/Photo/:id', PhotoController.updatePhotoController);

// DELETE route for deleting an existing event
router.delete('/Photo/:id', PhotoController.deletePhotoController);


module.exports = router;