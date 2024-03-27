<template>
    <div>
      <h1>Add Event</h1>
      <form @submit.prevent="submitForm">
        <label for="type">Type:</label>
        <select id="type"  v-model="formData.type" required>
            <option value="practice">Practice</option>
            <option value="game">Game</option>
            <option value="tournament">Tournament</option>
        </select>
        <label for="startDate">Start Date</label>
        <input type="datetime-local" id="startDate" v-model="formData.startDate" required>
        <label for="endDate">End Date</label>
        <input type="datetime-local" id="endDate"  v-model="formData.endDate" required>
        <label for="location">Location</label>
        <input type="text" id="location"  v-model="formData.location" required>
        <label for="league">League</label>
        <select id="league" v-model="formData.league" @change="fetchOpponents" required>
            <option value="">Select a League</option>
            <option v-for="league in leagues" :key="league._id" :value="league._id">{{ league.name }}</option>
        </select>
        <label for="opponent">Opponent</label>
        <select id="opponent" v-model="formData.opponent" required>
            <option value="">Select an Opponent</option>
            <option v-for="opponent in filteredOpponents" :key="opponent._id" :value="opponent._id">{{ opponent.name }}</option>
        </select>
        <label for="notes">Notes</label>
        <input type="text" id="notes"  v-model="formData.notes">
        <button type="submit">Submit</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, onMounted, computed } from 'vue';
  import LeagueService from '@/services/LeagueService.js';
  import TeamService from '@/services/TeamService.js';


 
    
  export default {
    setup() {
    const leagues = ref([]);
    const teams = ref([]);
    const formData = ref({
      type: '',
      startDate: '',
      endDate: '',
      location: '',
      opponent: '',
      league: '',
      notes: '',
    });
    const fetchOpponents = async () => {
      if (formData.value.league) {
        try {
          const teamData = await TeamService.getTeamsByLeague(formData.value.league); // Use TeamService
          teams.value = teamData;
          console.log("Teams fetched:", teams.value);
        } catch (error) {
          console.error("Failed to fetch teams:", error);
        }
      }
    };

    const filteredOpponents = computed(() => {
      return teams.value.filter(team => team.league === formData.value.league);
    });

    onMounted(async () => {
      console.log("Fetching leagues");
      try {
        const leagueData = await LeagueService.getLeagues();
        leagues.value = leagueData;
        console.log("Leagues fetched:", leagues.value);
      } catch (error) {
        console.error("Failed to fetch leagues:", error);
      }
    });

    return { leagues, teams, formData, fetchOpponents, filteredOpponents };
  }
};

//     onMounted(async () => {
//       console.log("fetching leagues and opponent");
//       // Fetch league data
//       try {
//         const leagueData = await LeagueService.getLeagues();
//         leagues.value = leagueData;
//         console.log("leagues fetched:", leagues.value);
//       } catch (error) {
//         console.error("Failed to fetch leagues:", error);
//       }
      
//       // Fetch opponent data
//       try {
//         const opponentData = await TeamService.getOpponents();
//         opponents.value = opponentData;
//         console.log("opponents fetched:", opponents.value);
//       } catch (error) {
//         console.error("Failed to fetch opponent:", error);
//       }
//     });

//     const submitForm = () => {
//       const endpointUrl = 'http://localhost:3000/events';

//       axios.post(endpointUrl, formData.value)
//         .then(response => {
//           // Handle successful response
//           console.log('Data posted successfully:', response.data);
//         })
//         .catch(error => {
//           // Handle error
//           console.error('Error posting data:', error);
//         });
//     };

//     return { leagues, opponents, formData, submitForm };
//   }
//   }
  </script>
 
<style scoped>
</style>