<template>
  <div>
    <h1>Add League</h1>
    <form @submit.prevent="addLeague()">
      <label for="leagueName">League Name:</label>
      <input type="text" id="leagueName" v-model="formData.name" required>
      <label for="season">Season:</label>
      <input type="text" id="season" v-model="formData.season" required>
      <button type="submit">Add League</button>
    </form>
    <div v-if="leagues.length">
      <h2>Current Leagues</h2>
      <table>
        <thead>
          <tr>
            <th>League Name</th>
            <th>Season</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="league in leagues" :key="league._id">
            <td>{{ league.name }}</td>
            <td>{{ league.season }}</td>
            <td>
              <button @click="editLeague(league._id)">Edit</button>
              <button @click="deleteLeague(league._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LeagueService from '@/services/LeagueService';

const formData = ref({
  name: '',
  season: ''
});
const leagues = ref([]);

const addLeague = async () => {
  if (formData.value.name.trim() !== '' && formData.value.season.trim() !== '') {
    try {
      const response = await LeagueService.addLeagues({
        name: formData.value.name,
        season: formData.value.season
      });
      const { message, league } = response.data; // Destructure the message and league from the response

      leagues.value.push(league); // Push the league object to the leagues array
      formData.value.name = ''; // Clear name input field after adding league
      formData.value.season = ''; // Clear season input field after adding league

      console.log(message); // Log the message
      console.log("New league added:", league); // Log the newly added league
    } catch (error) {
      console.error('Error adding league:', error);
    }
  } else {
    alert('Please enter both league name and season.');
  }
};

const editLeague = (leagueId) => {
  console.log('Editing league with ID:', leagueId);
  // Add your logic to navigate to the edit league page or open a modal for editing
};

const deleteLeague = async (leagueId) => {
  console.log("delete league")
  // if (confirm('Are you sure you want to delete this league?')) {
  //   try {
  //     await LeagueService.deleteLeague(leagueId);
  //     leagues.value = leagues.value.filter(league => league.id !== leagueId);
  //   } catch (error) {
  //     console.error('Error deleting league:', error);
  //   }
  // }
};

onMounted(async () => {
  try {
    const leagueData = await LeagueService.getLeagues();
    console.log("League data:", leagueData); // Log the league data
    leagues.value = leagueData;
    console.log("Leagues fetched:", leagues.value);
  } catch (error) {
    console.error("Failed to fetch leagues:", error);
  }
});

</script>
  
  <style>
  .table-container {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  text-align: left;
  padding: 8px;
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}

.actions-column button {
  display: inline-block;
  margin-right: 5px;
}
  </style>