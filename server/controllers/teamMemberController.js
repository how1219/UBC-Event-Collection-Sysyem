const TeamMemberModel = require('../models/teamMemberModel');

async function getAllTeamMembers(req, res) {
    try {
        const teamMembers = await TeamMemberModel.getAllTeamMembers();
        res.status(200).json({ data: teamMembers });
    } catch (error) {
        console.error('Error in getAllTeamMembers controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function addTeamMemberController(req, res) {
  try {
    const result = await TeamMemberModel.addTeamMember(req.body);
    if (result.success) {
      res.status(201).json({ message: 'Team member added successfully.', data: result.result });
    } else {
      res.status(400).json({ message: 'Could not add team member.', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error occurred while adding a team member.', error: error.toString() });
  }
}

async function updateTeamMemberController(req, res) {
  const { memberName, memberPhoneNo } = req.params;
  try {
    const result = await TeamMemberModel.updateTeamMember(memberName, memberPhoneNo, req.body);
    if (result.rowsAffected > 0) {
      res.status(200).json({ message: 'Team member updated successfully.' });
    } else {
      res.status(404).json({ message: 'No team member found with the given details.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error occurred while updating the team member.', error: error.toString() });
  }
}

async function deleteTeamMemberController(req, res) {
  const { memberName, memberPhoneNo } = req.params;
  try {
    const result = await TeamMemberModel.deleteTeamMember(memberName, memberPhoneNo);
    if (result.rowsAffected > 0) {
      res.status(200).json({ message: 'Team member deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Team member not found or already deleted.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error occurred while deleting the team member.', error: error.toString() });
  }
}




module.exports = {getAllTeamMembers, addTeamMemberController, updateTeamMemberController, deleteTeamMemberController};