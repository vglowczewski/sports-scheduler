// routes/teams.js
const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Event = require('../models/Event');

// Route to add a new team to a league
router.post('/:leagueId', async (req, res) => {
    try {
      const leagueId = req.params.leagueId;
      const { name } = req.body;
  
      // Create a new team
      const newTeam = new Team({ name, league: leagueId });
      await newTeam.save();
  
      res.json(newTeam);
    } catch (error) {
      console.error('Error adding team:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  // Route to delete a team from a league
  router.delete('/:teamId', async (req, res) => {
    try {
      const teamId = req.params.teamId;
  
      // Find the team by ID and delete it
      await Team.findByIdAndDelete(teamId);
  
      res.json({ message: 'Team deleted successfully' });
    } catch (error) {
      console.error('Error deleting team:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });  

  router.get('/noLeague', async (req, res) => {
    let teams;
    try {
      teams = await Team.find({league: null})
      res.json(teams);
    } catch(error) {
      console.error('Error getting team:', error)
      res.status(500).json({ message: 'Server Error' });
    }
  })

  // Update a team
router.put('/:teamId', async (req, res) => {
  const teamId = req.params.teamId;
  try {
      const updatedTeam = await Team.findByIdAndUpdate(teamId, req.body, { new: true });
      if (!updatedTeam) {
          return res.status(404).json({ message: 'Team not found' });
      }
      res.json({ message: 'Team updated successfully', team: updatedTeam });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;