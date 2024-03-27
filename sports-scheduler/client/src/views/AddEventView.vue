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
        <label for="opponent">Opponent</label>
        <input type="text" id="opponent"  v-model="formData.opponent">
        <label for="league">League</label>
        <select id="league" v-model="formData.league" required>
            <option value="">Select a League</option>
            <option v-for="league in leagues" :key="league.id" :value="league.id">{{ league.name }}</option>
        </select>
        <label for="notes">Notes</label>
        <input type="text" id="notes"  v-model="formData.notes">
        <button type="submit">Submit</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import LeagueService from '@/services/LeagueService.js'

    //leagues variable starts empty
    const leagues = ref([]);

    onMounted(async () => {
    console.log("fetching leagues")
    // Fetch league data
    try {
        const leagueData = await LeagueService.getLeagues();
        leagues.value = leagueData; //issue here
        console.log("leagues fetched")
        console.log(leagues);
    } catch (error) {
        console.error("Failed to fetch leagues:", error);
    }
    });
    
  export default {
    data() {
      return {
        formData: {
          type: '',
          startDate: '',
          endDate: '',
          location: '',
        //   opponent: '',
        //   league: '',
          notes: '',
        }
      };
    },
    methods: {
      submitForm() {
        // Replace 'https://example.com/api/endpoint' with your API endpoint URL
        const endpointUrl = 'http://localhost:3000/events';
  
        axios.post(endpointUrl, this.formData)
          .then(response => {
            // Handle successful response
            console.log('Data posted successfully:', response.data);
          })
          .catch(error => {
            // Handle error
            console.error('Error posting data:', error);
          });
      }
    }
  }
  </script>
 
<style scoped>
</style>