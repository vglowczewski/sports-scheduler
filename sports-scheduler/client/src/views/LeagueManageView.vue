<template>
  <div>
    <h1>Add League</h1>
    <form @submit.prevent="addLeague">
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
              <button @click="addTeams(league._id)">Add Teams</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Modal -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>Add Teams</h2>
        <ul>
          <li v-for="team in teams" :key="team._id" :value="team._id">{{ team.name }}</li>
        </ul>
        <ul>
          <li v-for="availableTeam in availableTeams" :key="availableTeam._id" :value="availableTeam._id">{{ availableTeam.name }}</li>
        </ul>
  </div>
  </div> 
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LeagueService from '@/services/LeagueService';
import TeamService from '@/services/TeamService';

const formData = ref({
  name: '',
  season: ''
});
const leagues = ref([]);
const teams = ref([]);
const availableTeams = ref([]);
const showModal = ref(false);

const addLeague = async () => {
  if (formData.value.name.trim() !== '' && formData.value.season.trim() !== '') {
    try {
      const leagueData = {
        name: formData.value.name,
        season: formData.value.season
      };

      const response = await LeagueService.addLeague(leagueData);
      const league = response.league; // Response should contain the league object directly
      leagues.value.push(league); // Push the league object to the leagues array
      formData.value.name = ''; // Clear name input field after adding league
      formData.value.season = ''; // Clear season input field after adding league
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
  try {
    // Ask for confirmation
    if (confirm('Are you sure you want to delete this league?')) {
      // Send a request to delete the league with the specified ID
      await LeagueService.deleteLeague(leagueId);
      
      // Remove the league from the leagues array
      leagues.value = leagues.value.filter(league => league._id !== leagueId);
      
      console.log("League deleted successfully.");
    }
  } catch (error) {
    console.error('Error deleting league:', error);
  }
};

const addTeams = async (leagueId) => {
  try {
    const currentTeams = await TeamService.getTeamsByLeague(leagueId);
    console.log("current teams", currentTeams);
    teams.value = currentTeams;

    const addableTeams = await TeamService.getAddableTeams();
    console.log("addable teams", addableTeams);
    availableTeams.value = addableTeams;
  } catch(error){
    console.log('Error', error)
  }
  showModal.value = true;
}

// Close edit modal function
function closeModal() {
  console.log("Closing modal");
  showModal.value = false;
}

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
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
  </style>