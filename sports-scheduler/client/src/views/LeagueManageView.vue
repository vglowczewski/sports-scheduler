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
    <div>
    <h2>Filter Leagues</h2>
    <select id="season" v-model="filterData.season">
        <option value="Fall">Fall</option>
        <option value="Winter">Winter</option>
        <option value="Spring">Spring</option>
      </select>
    </div>
    <!-- Filter button -->
    <div>
      <button @click="handleFilterClick">Filter</button>
    </div>
    <div>
      <button @click="resetFilters">Reset Filters</button>
    </div>
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
          <tr v-for="filteredLeague in filteredLeagues" :key="filteredLeague._id">
            <td>{{ filteredLeague.name }}</td>
            <td>{{ filteredLeague.season }}</td>
            <td>
              <button @click="editLeague(filteredLeague._id)">Edit</button>
              <button @click="deleteLeague(filteredLeague._id)">Delete</button>
              <button @click="manageTeams(filteredLeague._id)">Manage Teams</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Teams Modal -->
    <div class="modal" v-if="showTeamsModal">
      <div class="modal-content">
        <span class="close" @click="closeTeamsModal">&times;</span>
        <h1>Manage Teams</h1>
        <h2 v-if="teams.length > 0">Current Teams</h2>
        <ul>
         <li v-for="team in teams" :key="team._id" :value="team._id">
            {{ team.name }}
           <!-- button to remove team from league -->
           <button @click="removeTeamFromLeague(team)">X</button>
          </li>
        </ul>
        <!-- Add Team Form -->
        <h2>Add Team</h2>
        <form @submit.prevent="addTeamToLeague">
          <label for="teamName">Team Name:</label>
          <input type="text" id="teamName" v-model="newTeamName" required>
          <button type="submit">Add Team</button>
        </form>
        <!-- <h2 v-if="availableTeams.length > 0">Available Teams</h2>
        <ul>
          <li v-for="availableTeam in availableTeams" :key="availableTeam._id" :value="availableTeam._id">
            {{ availableTeam.name }}
            <button @click="addTeamToLeague(availableTeam)">+</button>
          </li>
        </ul> -->
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
const filterData = ref({
  season: ''
})
const leagues = ref([]);
const teams = ref([]);
const filteredLeagues = ref([]);
// const availableTeams = ref([]);
const showTeamsModal = ref(false);
const showEditModal = ref(false);
const selectedLeagueId = ref('');
// const currentLeague = ref('');
const newTeamName = ref('');

const handleFilterClick = () => {
  filterLeagues();
}

const filterLeagues = () => {
  if(!filterData.value.season){
    filteredLeagues.value = leagues.value;
    return; 
  }
  const selectedSeason = filterData.value.season;
  filteredLeagues.value = leagues.value.filter(league => league.season === selectedSeason);
}

//reset the filters 
function resetFilters() {
  filterData.value.season = '';
  filterLeagues();
}

const addLeague = async () => {
  if (formData.value.name.trim() !== '' && formData.value.season.trim() !== '') {
    try {
      const leagueData = {
        name: formData.value.name,
        season: formData.value.season
      };

      const response = await LeagueService.addLeague(leagueData);
      const leagueId = response._id; // Access the league ID from the response

      // Push the newly added league to the leagues array
      leagues.value.push({
        _id: leagueId, // Ensure the league object has the _id property
        name: formData.value.name,
        season: formData.value.season
      });

      formData.value.name = ''; // empty the name input field after adding league
      formData.value.season = ''; // empty the season input field after adding league

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
  openEditModal(leagueId); //trigger the opening of the edit modal
};

const deleteLeague = async (leagueId) => {
  try {
    // Ask for confirmation
    if (confirm('Are you sure you want to delete this league?')) {
      // Send a request to delete the league with the specified ID
      await LeagueService.deleteLeague(leagueId);
      
      // Remove the league from the leagues array because now deleted
      leagues.value = leagues.value.filter(league => league._id !== leagueId);
      console.log("League deleted successfully.");
    }
  } catch (error) {
    console.error('Error deleting league:', error);
  }
};

// Add Teams to a league
const manageTeams = async (leagueId) => {
  try {
    // Set the selected league ID
    selectedLeagueId.value = leagueId;
    // Fetch teams for the selected league
    await fetchTeams(leagueId);
  } catch(error){
    console.log('Error', error)
  }
  showTeamsModal.value = true;
}

// Get the Teams that belong to a specific league
const fetchTeams = async (leagueId) => {
  const currentTeams = await TeamService.getTeamsByLeague(leagueId);
  console.log("current teams", currentTeams);
  teams.value = currentTeams;
}

// Get all the teams that are available to be added to the league
// const fetchAddableTeams = async () => {
//   const addableTeams = await TeamService.getAddableTeams();
//   console.log("addable teams", addableTeams);
//   availableTeams.value = addableTeams;
// }

// Add Team To League Function
const addTeamToLeague = async () => {
  if (newTeamName.value.trim() !== '') {
    try {
      // Ensure selectedLeagueId is not empty
      if (selectedLeagueId.value) {
        const teamData = {
          name: newTeamName.value,
          // Pass the selected league ID to the createTeam method
          league: selectedLeagueId.value
        };
        // Call createTeam with teamData and selectedLeagueId.value
        await TeamService.createTeam(teamData, selectedLeagueId.value);
        // Fetch teams for the selected league after adding a new team
        await fetchTeams(selectedLeagueId.value);
        newTeamName.value = ''; // Clear input field after adding team
      } else {
        console.error('No league selected to add team to.');
      }
    } catch(error){
      console.log('Error adding team to league', error)
    }
  } else {
    alert('Please enter a team name.');
  }
}

// Remove Team From League Function
const removeTeamFromLeague = async (team) => {
  try {
    // Call the TeamService method to delete the team entirely
    await TeamService.deleteTeam(team._id);
    // Fetch teams for the selected league after removing the team
    fetchTeams(selectedLeagueId.value);
  } catch(error) {
    console.error('Error removing team from league', error);
  }
}

// Close teams modal function
function closeTeamsModal() {
  console.log("Closing teams modal");
  showTeamsModal.value = false;
  // currentLeague.value = '';
}

// Open the Edit Modal for user to update league
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

// Close the Edit Modal when user complete
function closeEditModal() {
  console.log("Closing edit modal");
  showEditModal.value = false;
}

// Get all the leagues
const fetchLeagues = async () => {
  try {
    const leagueData = await LeagueService.getLeagues();
    leagues.value = leagueData;
    console.log("Leagues fetched:", leagues.value);
  } catch (error) {
    console.error("Failed to fetch leagues:", error);
  }
};

// When button clicked in the edit form
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
    filteredLeagues.value = leagues.value;
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