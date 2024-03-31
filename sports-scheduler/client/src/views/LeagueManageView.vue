<template>
  <div>
    <h1>Add League</h1>
    <form @submit.prevent="addLeague">
      <label for="leagueName">League Name:</label>
      <input type="text" id="leagueName" v-model="formData.name" required>
      <label for="season">Season:</label>
      <select id="season" v-model="formData.season" required>
        <option value="Fall">Fall</option>
        <option value="Winter">Winter</option>
        <option value="Spring">Spring</option>
      </select>
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
    <!-- Teams Modal -->
    <div class="modal" v-if="showTeamsModal">
      <div class="modal-content">
        <span class="close" @click="closeTeamsModal">&times;</span>
        <h2>Add Teams</h2>
        <ul>
          <li v-for="team in teams" :key="team._id" :value="team._id">{{ team.name }}</li>
        </ul>
        <ul>
          <li v-for="availableTeam in availableTeams" :key="availableTeam._id" :value="availableTeam._id">
            {{ availableTeam.name }}
            <button @click="addTeamToLeague(availableTeam)">+</button>
          </li>
        </ul>
    </div>
  </div> 
   <!-- Edit Modal -->
   <div class="modal" v-if="showEditModal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Edit League</h2>
        <form @submit.prevent="submitForm">
        <label for="editLeagueName">League Name:</label>
        <input type="text" id="editLeagueName" v-model="editFormData.name" required>
        <label for="editSeason">Season:</label>
        <select id="editSeason" v-model="editFormData.season" required>
          <option value="Fall">Fall</option>
          <option value="Winter">Winter</option>
          <option value="Spring">Spring</option>
        </select>
        <button type="submit">Update League</button>
      </form>
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
const editFormData = ref({
  name: '',
  season: ''
});
const leagues = ref([]);
const teams = ref([]);
const availableTeams = ref([]);
const showTeamsModal = ref(false);
const showEditModal = ref(false);
const selectedLeagueId = ref('');
const currentLeague = ref('');

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
      await fetchLeagues(); //retrigger the table so it gets updated
    } catch (error) {
      console.error('Error adding league:', error);
    }
  } else {
    alert('Please enter both league name and season.');
  }
};

const editLeague = (leagueId) => {
  console.log('Editing league with ID:', leagueId);
  openEditModal(leagueId);
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
  currentLeague.value = leagueId;
  try {
    fetchTeams(leagueId);
    fetchAddableTeams();
  } catch(error){
    console.log('Error', error)
  }
  showTeamsModal.value = true;
}

const fetchTeams = async (leagueId) => {
  const currentTeams = await TeamService.getTeamsByLeague(leagueId);
  console.log("current teams", currentTeams);
  teams.value = currentTeams;
}

const fetchAddableTeams = async () => {
  const addableTeams = await TeamService.getAddableTeams();
  console.log("addable teams", addableTeams);
  availableTeams.value = addableTeams;
}

const addTeamToLeague = async (team) => {
  const teamData = {
    name: team.name,
    league: currentLeague.value
  }
  try {
    await TeamService.updateTeam(team._id, teamData);
    fetchTeams(currentLeague.value);
    fetchAddableTeams();
  } catch(error){
    console.log('Error adding team to league', error)
  }
}

// Close edit modal function
function closeTeamsModal() {
  console.log("Closing teams modal");
  showTeamsModal.value = false;
  currentLeague.value = '';
}

async function openEditModal(leagueId) {
  console.log("Opening edit modal for league with ID:", leagueId);
  selectedLeagueId.value = leagueId;
  try {
    const league = leagues.value.find(league => league._id === leagueId);
    if (league) {
      editFormData.value.name = league.name;
      editFormData.value.season = league.season;
    } else {
      console.error("League not found");
    }
  } catch (error) {
    console.error("Failed to fetch league details:", error);
  }
  showEditModal.value = true;
}

function closeEditModal() {
  console.log("Closing edit modal");
  showEditModal.value = false;
}

const fetchLeagues = async () => {
  try {
    const leagueData = await LeagueService.getLeagues();
    leagues.value = leagueData;
    console.log("Leagues fetched:", leagues.value);
  } catch (error) {
    console.error("Failed to fetch leagues:", error);
  }
};

async function submitForm() {
  try {
    console.log("selectedLeagueId", selectedLeagueId.value)
    await LeagueService.updateLeague(selectedLeagueId.value, editFormData.value);
    await fetchLeagues();
    alert('League updated successfully');
    closeEditModal();
  } catch (error) {
    console.error('Failed to update league:', error);
    alert('Failed to update league.');
  }
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