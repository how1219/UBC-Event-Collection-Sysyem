const OrganizerModel = require('../models/organizerModel');

async function getAllOrganizers(req, res) {
    try {
        const organizers = await OrganizerModel.getAllOrganizers();
        res.status(200).json({ data: organizers });
    } catch (error) {
        console.error('Error in getAllOrganizers controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getTotalEventsByOrganizers(req, res) {
    try {
        const organizers = await OrganizerModel.getTotalEventsByOrganizers();
        res.status(200).json({ data: organizers });
    } catch (error) {
        console.error('Error in getTotalEventsByOrganizers controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getHighestAverageRating(req, res) {
    try {
        const highestRating = await OrganizerModel.getHighestAverageRating();
        res.status(200).json(highestRating);
    } catch (error) {
        console.error('Error in getHighestAverageRating controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getOrganizerContactDetail(req, res) {
    try {
        const contactDetail = await OrganizerModel.getOrganizerContactDetail();
        res.status(200).json(contactDetail);
    } catch (error) {
        console.error('Error in getOrganizerContactDetail controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function addOrganizerController(req, res) {
  const organizerDetails = req.body;
  const result = await OrganizerModel.addOrganizer(organizerDetails);
  if (result.success) {
     res.status(201).json({message: 'Organizer created successfully.'});
  } else {
    res.status(500).json(result.error);
  }
}

async function updateOrganizerController(req, res) {
  const organizerID = req.params.id;
  const updateFields = req.body;
  const result = await OrganizerModel.updateOrganizer(organizerID, updateFields);
  console.log(result);
  if (result.rowsAffected > 0) {
    res.status(201).json({message: 'Organizer updated successfully.'});
  } else {
    res.status(500).json(result.error);
  }
}

async function deleteOrganizerController(req, res) {
  const organizerID = req.params.id;

  try {
    const result = await OrganizerModel.deleteOrganizer(organizerID);

    if (result.success) {
      res.status(200).json({ message: 'Organizer deleted successfully.' });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the organizer.', error: error.toString() });
  }
}





module.exports = {getAllOrganizers, addOrganizerController, updateOrganizerController, deleteOrganizerController, getTotalEventsByOrganizers,
getHighestAverageRating, getOrganizerContactDetail};