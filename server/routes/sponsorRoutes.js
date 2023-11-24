const express = require('express');
const router = express.Router();
const SponsorController = require('../controllers/sponsorController');

// Existing GET route for fetching all organizers
router.get('/sponsor', SponsorController.getAllSponsors());

// POST route for adding a new team member
router.post('/sponsor', SponsorController.addSponsorController());

// PUT route for updating an existing team member by MemberName and MemberPhoneNo
router.put('/sponsor/:sponsorName/:sponsorPhoneNo', SponsorController.updateSponsorController());

// DELETE route for deleting an existing team member by MemberName and MemberPhoneNo
router.delete('/sponsor/:sponsorName/:sponsorPhoneNo', SponsorController.deleteSponsorController());


module.exports = router;