// routes/teams.js
const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// Route to get all teams based on the league ID
router.get('league/:leagueId', async (req, res) => {
    try {
      const leagueId = req.params.leagueId;
  
      // Find teams associated with the league ID
      const teams = await Team.find({ league: leagueId });
  
      res.json(teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ message: 'Server Error' });
    }
});

// Route to add a new team to a league
router.post('/teams/:leagueId', async (req, res) => {
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
  router.delete('/teams/:teamId', async (req, res) => {
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

module.exports = router;