const SponsorModel = require('../models/sponsorModel');

async function getAllSponsors(req, res) {
    try {
        const sponsors = await SponsorModel.getAllSponsors();
        res.status(200).json({ data: sponsors });
    } catch (error) {
        console.error('Error in getAllSponsors controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getSponsorsWhoSupportedAllTypes(req, res) {
    try {
        const sponsors = await SponsorModel.getSponsorsWhoSupportedAllTypes();
        res.status(200).json(sponsors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sponsors', error });
    }
}

async function addSponsorController(req, res) {
    try {
        const result = await SponsorModel.addSponsor(req.body);
        if (result.success) {
            res.status(201).json({ message: 'Sponsor added successfully.', data: result.result });
        } else {
            res.status(400).json({ message: 'Could not add sponsor.', error: result.error });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error occurred while adding a sponsor.', error: error.toString() });
    }
}

async function updateSponsorController(req, res) {
    const { sponsorName, sponsorPhoneNo } = req.params;
    try {
        const result = await SponsorModel.updateSponsor(sponsorName, sponsorPhoneNo, req.body);
        if (result.rowsAffected > 0) {
            res.status(200).json({ message: 'Sponsor updated successfully.' });
        } else {
            res.status(404).json({ message: 'No sponsor found with the given details.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error occurred while updating the sponsor.', error: error.toString() });
    }
}

async function deleteSponsorController(req, res) {
    const { sponsorName, sponsorPhoneNo } = req.params;
    try {
        const result = await SponsorModel.deleteSponsor(sponsorName, sponsorPhoneNo);
        if (result.rowsAffected > 0) {
            res.status(200).json({ message: 'Sponsor deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Sponsor not found or already deleted.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error occurred while deleting the sponsor.', error: error.toString() });
    }
}




module.exports = {getAllSponsors, addSponsorController, updateSponsorController, deleteSponsorController, getSponsorsWhoSupportedAllTypes};