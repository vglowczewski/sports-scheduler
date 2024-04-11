<template>
    <!-- Hero Section -->
    <section class="hero is-success">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">Manage League</h1>
        </div>
      </div>
  </section>
  <div class="container has-text-centered">
    
    <!-- Add League -->
    <div class="columns is-multiline">
      <div class="column is-half-desktop is-full-tablet">
    <div class="section">
      <h1 class="title is-4">Add League</h1>
      <form @submit.prevent="addLeague" class="center-form">
        <div class="columns is-centered">
          <div class="column is-half">
            <!-- League Name -->
            <div class="field">
              <label class="label" for="leagueName">League Name:</label>
              <div class="control">
                <input class="input" type="text" id="leagueName" v-model="formData.name" required>
              </div>
            </div>
          </div>
          
          <div class="column is-half">
            <!-- Season Dropdown -->
            <div class="field">
              <label class="label" for="season">Season:</label>
              <div class="control">
                <div class="select">
                  <select id="season" v-model="formData.season" required>
                    <option value="Fall">Fall</option>
                    <option value="Winter">Winter</option>
                    <option value="Spring">Spring</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-success" type="submit">Add League</button>
          </div>
        </div>
        
      </form>
    </div>
    </div>

    <!-- Filter Fields -->
    <div class="column is-half-desktop is-full-tablet">
    <div class="section">
      <h1 class="title is-4">Filter Leagues</h1>
      <div class="field">
        <label class="label">Season:</label>
        <div class="control">
          <div class="select">
            <select id="seasonFilter" v-model="filterData.season">
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
            </select>
          </div>
        </div>
      </div>

    <!-- Filter button -->
    <div class="field is-grouped is-grouped-centered">
      <div>
        <button class="button is-success" @click="handleFilterClick">Filter</button>
      </div>
      <div>
        <button class="button is-success is-outlined" @click="resetFilters">Reset Filters</button>
      </div>
    </div>
  </div>
</div>
</div>

    <!-- Current Leagues -->
    <div class="section">
      <div v-if="leagues.length">
        <h2 class="title is-4">Current Leagues</h2>
        <table class="table is-bordered is-hoverable is-fullwidth">
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
                <span class="icon-clickable" @click="editLeague(filteredLeague._id)">
                <i class="fas fa-edit"></i>
              </span>
              <span class="icon-clickable" @click="deleteLeague(filteredLeague._id)">
                <i class="fas fa-trash"></i>
              </span>
              <span class="icon-clickable" @click="manageTeams(filteredLeague._id)">
                <i class="fas fa-users"></i>
              </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    

    <!-- Teams Modal -->
<div class="modal" :class="{ 'is-active': showTeamsModal }">
  <div class="modal-background"></div>
  <div class="modal-card"> 
    <header class="modal-card-head">
      <p class="modal-card-title title is-3">Manage Teams</p>
      <button class="delete is-responsive" aria-label="close" @click="closeTeamsModal"></button>
    </header>
    <section class="modal-card-body"> 
      <div class="columns is-centered"> <!-- Centered columns -->
        <div class="column is-half">
          <h2 class="title is-5" v-if="teams.length > 0">Current Teams</h2>
          <ul class="content">
            <li v-for="team in teams" :key="team._id" :value="team._id">
              {{ team.name }}
              <!-- button to remove team from league -->
              <span @click="removeTeamFromLeague(team)">
                <i class="fas fa-trash"></i>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <!-- Add Team Form -->
      <div class="columns is-centered"> <!-- Centered columns -->
        <div class="column is-half">
          <h2 class="title is-5">Add Team</h2>
          <form @submit.prevent="addTeamToLeague">
            <div class="field">
              <label class="label" for="teamName">Team Name:</label>
              <div class="control">
                <input class="input" type="text" id="teamName" v-model="newTeamName" required>
              </div>
            </div>
            <div class="control">
              <button class="button is-success" type="submit">Add Team</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</div>
        
 <!-- Edit Modal -->
<div class="modal" :class="{ 'is-active': showEditModal }">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit Event</p>
      <button class="delete is-responsive" aria-label="close" @click="closeEditModal"></button>
    </header>
    <section class="modal-card-body">
      <div class="columns is-centered"> <!-- Centered columns -->
        <div class="column is-half">
          <!-- Form -->
          <form @submit.prevent="submitForm">
            <!--League Name field-->
            <div class="field">
              <label class="label" for="editLeagueName">League Name:</label>
              <div class="control">
                <input class="input" type="text" id="editLeagueName" v-model="editFormData.name" required>
              </div>
            </div>
            <!--Season field-->
            <div class="field">
              <label class="label" for="editSeason">Season:</label>
              <div class="control">
                <div class="select">
                  <select id="editSeason" v-model="editFormData.season" required>
                    <option value="Fall">Fall</option>
                    <option value="Winter">Winter</option>
                    <option value="Spring">Spring</option>
                  </select>
                </div>
              </div>
            </div>
            <!--Button-->
            <div class="field">
              <button class="button is-success" type="submit">Update League</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</div>
    
      <!-- Social Links -->
      <footer class="footer">
    <div class="content has-text-centered">
      <p class="social-icons">
        <a href="#"><span style="color: #48C774;"><i class="fab fa-facebook fa-lg"></i></span></a>
      <a href="#"><span style="color: #48C774;"><i class="fab fa-twitter fa-lg"></i></span></a>
      <a href="#"><span style="color:#48C774;"><i class="fab fa-instagram fa-lg"></i></span></a>
      <a href="#"><span style="color: #48C774;"><i class="fab fa-youtube fa-lg"></i></span></a>
      </p>
      <p>
        <strong>Bayview Glen Independent School</strong> &copy; 2024. All rights reserved.
      </p>
    </div>
  </footer>
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
      filterLeagues() //need tihs for table to update
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
    // Update filteredLeagues as well to update table
      filterLeagues()
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

.center-form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  /* Reduce gap between fields */
  .field:not(:last-child) {
    margin-bottom: 1rem;
  }

  .icon-clickable {
    margin-right: 0.8rem; /* Adjust the margin to add space between icons */
    cursor: pointer;
  }

  .social-icons a {
  margin-right: 1.0rem; /* Adjust the margin to add more space between icons */
}

  </style>