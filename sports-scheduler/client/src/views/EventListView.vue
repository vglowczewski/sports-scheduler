<script setup>
import { ref, onMounted, computed } from 'vue';
import Table from '@/components/TableComponent.vue';
// import EditModal from '@/components/EditModal.vue';
import LeagueService from '@/services/LeagueService.js';
import EventService from '@/services/EventService.js';
import TeamService from '@/services/TeamService.js'

const isLoadingEvents = ref(true);

//events variable starts empty
const events = ref([]);
const leagues = ref([]);
const teams = ref([]);
const isLoggedInAsAdmin = ref(true);
const showEditModal = ref(false);
const selectedLeagues = ref([]);
const filteredEvents = ref([]); 
const selectedEventId = ref('');
const editFormData = ref({
  type: '',
  startDate: '',
  endDate: '',
  location: '',
  opponent: '',
  league: '',
  notes: '',
});
const filterData = ref({
  startDate: '',
  endDate: '',
});



onMounted(async () => {
  try {
    await fetchEvents();
    await fetchLeagues();
    filteredEvents.value = events.value;
    console.log("filteredEvents", filteredEvents.value)
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Set isLoadingEvents to false after fetching
    isLoadingEvents.value = false;
  }
});

async function fetchEvents() {
  try {
    events.value = await EventService.getEvents();
    console.log("events", events.value)
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }
}

// Fetch leagues function
async function fetchLeagues() {
  try {
    const leagueData = await LeagueService.getLeagues();
    leagues.value = leagueData;
    if (leagueData.length > 0 && !editFormData.value.league) { // Check if editFormData.value.league is not already set
      editFormData.value.league = leagueData[0]._id; // Set default league
      await fetchOpponents(leagueData[0]._id); // Fetch opponents for the default league
    }
  } catch (error) {
    console.error("Failed to fetch leagues:", error);
  }
}

const fetchOpponents = async () => {
  if (editFormData.value.league) {
    try {
      const teamData = await TeamService.getTeamsByLeague(editFormData.value.league); // Use TeamService
      teams.value = teamData;
      console.log("Teams fetched:", teams.value);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  }
};

const filteredOpponents = computed(() => {
  return teams.value.filter(team => team.league === editFormData.value.league);
});

function filterEvents() {
  const hasDateFilter = filterData.value.startDate && filterData.value.endDate;
  const hasLeagueFilter = selectedLeagues.value.length > 0;

  if (!hasDateFilter && !hasLeagueFilter) {
    filteredEvents.value = events.value;
    return;
  }

    // Convert filterData.startDate and filterData.endDate to ISO format
    const selectedStartDate = filterData.value.startDate ? new Date(filterData.value.startDate).toISOString().slice(0, 19).replace('T', ' ') : null;
    const selectedEndDate = filterData.value.endDate ? new Date(filterData.value.endDate).toISOString().slice(0, 19).replace('T', ' ') : null;
    // Apply date filter
    const filteredByDate = events.value.filter(event => {
    const startDate = event.startDate;
    const endDate = event.endDate;
    return (!selectedStartDate || startDate >= selectedStartDate) && (!selectedEndDate || endDate <= selectedEndDate);
  });

  const filteredByLeagues = hasLeagueFilter ?
  filteredByDate.filter(event => {
    const eventLeagueId = event.league._id.toString(); // Extract ObjectId from object and convert to string
    const isIncluded = selectedLeagues.value.includes(eventLeagueId);
    console.log("selectedLeagues", selectedLeagues.value)
    if (!isIncluded) {
      console.log(`Event with ID ${event._id} filtered out because league ${eventLeagueId} is not selected.`);
    }
    return isIncluded;
  }) :
  filteredByDate;

  filteredEvents.value = filteredByLeagues;
  console.log("filteredEvents", filteredEvents)
}

function handleFilterClick() {
  filterEvents();
}
// // Watch for changes in events or selectedLeagues and update filteredEvents
// watch([events, selectedLeagues], () => {
//   filterEvents();
// });

async function openEditModal(eventId) {
  console.log("Opening edit modal for event with ID:", eventId);
  selectedEventId.value = eventId;
  try {
    const eventData = await EventService.getEventById(eventId);
    console.log("opponent", eventData.opponent)
    console.log("league", eventData.league)
    console.log(eventData)
    if (eventData) {
      // Format dates to match the required format
      const formattedStartDate = new Date(eventData.startDate).toISOString().slice(0, 16);
      const formattedEndDate = new Date(eventData.endDate).toISOString().slice(0, 16);

      // Populate editFormData with event data
      editFormData.value = {
        type: eventData.type,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        location: eventData.location,
        league: eventData.league,
        opponent: eventData.opponent,
        notes: eventData.notes,
      };

      editFormData.value.league = eventData.league._id;
      editFormData.value.opponent = eventData.opponent._id

      // Fetch leagues and teams data
      await fetchLeagues();
      await fetchOpponents();

    } else {
      console.error("Event data not found");
      // Handle the case where event details are not found
    }
  } catch (error) {
    console.error("Failed to fetch event details:", error);
    // Handle any errors that occurred during fetch
  }
  showEditModal.value = true;
}

// Close edit modal function
function closeEditModal() {
  console.log("Closing edit modal");
  showEditModal.value = false;
}


const submitForm = async () => {
  if (editFormData.value.type === 'tournament' || editFormData.value.type === 'practice') {
    editFormData.value.opponent = null; // Or however you wish to indicate no specific opponent
  }
  try {
    // Update the event
    await EventService.updateEvent(selectedEventId.value, editFormData.value);
    // Refresh events
    const updatedEvents = await EventService.getEvents();
    events.value.splice(0, events.value.length, ...updatedEvents); // Clear and replace with new data
    alert('Event updated successfully');
    closeEditModal();
  } catch (error) {
    console.error('Failed to update event:', error);
    alert('Failed to update event.');
  }
};

//reset the filters 
function resetFilters() {
  selectedLeagues.value = [];
  filterData.value.startDate = '';
  filterData.value.endDate = '';
  filterEvents();
}

</script>

<template>
    <div>
    <h1>Events List</h1>
    <div>
      <label for="startDate">Start Date:</label>
      <input type="datetime-local" id="startDate" v-model="filterData.startDate" required>
    </div>
    <div>
      <label for="endDate">End Date:</label>
      <input type="datetime-local" id="endDate" v-model="filterData.endDate" required>
    </div>
    <!-- League picklist -->
    <div>
      <label for="league">Select League(s):</label>
      <select id="league" v-model="selectedLeagues" multiple @change="fetchOpponents">
        <option v-for="league in leagues" :key="league._id" :value="league._id">{{ league.name }}</option>
      </select>
    </div>
    <!-- Filter button -->
    <div>
      <button @click="handleFilterClick">Filter</button>
    </div>
    <div>
      <button @click="resetFilters">Reset Filters</button>
    </div>
    <div v-if="isLoadingEvents">
      <p>Events Loading...</p>
    </div>
    <div v-else-if="filteredEvents.length > 0">
      <Table :events="filteredEvents" :is-logged-in-as-admin="isLoggedInAsAdmin" @open-edit-modal="openEditModal"/>
    </div>
    <div v-else>
      <p>No events to display.</p>
    </div>
        <!-- Modal -->
        <div class="modal" v-if="showEditModal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Edit Event</h2>
      <form @submit.prevent="submitForm">
        <label for="type">Type:</label>
        <select id="type" v-model="editFormData.type" required>
            <option value="practice">Practice</option>
            <option value="game">Game</option>
            <option value="tournament">Tournament</option>
        </select>
        <label for="startDate">Start Date</label>
        <input type="datetime-local" id="startDate" v-model="editFormData.startDate" required>
        <label for="endDate">End Date</label>
        <input type="datetime-local" id="endDate" v-model="editFormData.endDate" required>
        <label for="location">Location</label>
        <input type="text" id="location" v-model="editFormData.location" required>
        <label for="league">League</label>
        <select id="league" v-model="editFormData.league" @change="fetchOpponents" required>
            <option value="">Select a League</option>
            <option v-for="league in leagues" :key="league._id" :value="league._id">{{ league.name }}</option>
        </select>
        <label for="opponent" v-if="editFormData.type !== 'tournament' && editFormData.type !== 'practice'">Opponent</label>
      <select id="opponent" v-model="editFormData.opponent" v-if="editFormData.type !== 'tournament' && editFormData.type !== 'practice'">
          <option value="">Select an Opponent</option>
          <option v-for="opponent in filteredOpponents" :key="opponent._id" :value="opponent._id">{{ opponent.name }}</option>
      </select>
        <label for="notes">Notes</label>
        <input type="text" id="notes" v-model="editFormData.notes">
        <button type="submit">Update Event</button>
      </form>
      </div>
    </div>
    <!-- <EditModal :show="showEditModal" :eventId="selectedEventId" @close="closeEditModal"/> -->
  </div>
</template>
 
<style scoped>
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