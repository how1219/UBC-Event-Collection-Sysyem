const express = require('express');
const router = express.Router();
const TeamMemberController = require('../controllers/teamMemberController');

// Existing GET route for fetching all organizers
router.get('/teamMember', TeamMemberController.getAllTeamMembers);

// POST route for adding a new team member
router.post('/teamMember', TeamMemberController.addTeamMemberController);

// PUT route for updating an existing team member by MemberName and MemberPhoneNo
router.put('/teamMember/:memberName/:memberPhoneNo', TeamMemberController.updateTeamMemberController);

// DELETE route for deleting an existing team member by MemberName and MemberPhoneNo
router.delete('/teamMember/:memberName/:memberPhoneNo', TeamMemberController.deleteTeamMemberController);


module.exports = router;