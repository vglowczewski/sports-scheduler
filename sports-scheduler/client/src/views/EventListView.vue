<script setup>
import { ref, onMounted, computed } from 'vue';
import Table from '@/components/TableComponent.vue';
// import EditModal from '@/components/EditModal.vue';
import LeagueService from '@/services/LeagueService.js';
import EventService from '@/services/EventService.js';
import TeamService from '@/services/TeamService.js'
import { useStore } from 'vuex';

const store = useStore(); // Initialize Vuex store

const isLoggedIn = computed(() => {
  return store.getters['isLoggedIn'];
});

const currentUser = computed(() => {
  return store.getters['currentUser'];
});

console.log("isLoggedIn", isLoggedIn.value);
console.log("currentUser", currentUser.value)

const isLoadingEvents = ref(true);

//events variable starts empty
const events = ref([]);
const leagues = ref([]);
const teams = ref([]);
// const isLoggedInAsAdmin = ref(true);
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

      console.log("opponent id", eventData.opponent._id)
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
    filterEvents()
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

const handleDeleteEvent = (eventId) => {
  // Find the index of the deleted event in the events array
  const index = events.value.findIndex(event => event._id === eventId);
  if (index !== -1) {
    // Remove the deleted event from the events array
    events.value.splice(index, 1);
  }
};

</script>

<template>
      <!-- Hero Section -->
    <section class="hero is-success">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">Events List</h1>
        </div>
      </div>
  </section>
  <div class="container">
    <div>
      <!-- Loading Indicator -->
      <div v-if="isLoadingEvents" class="notification">
        Events Loading...
      </div>
      <!-- Filtering Fields -->
      <section class="section">
        <div class="columns is-centered">
          <!-- Date Inputs and Picklist -->
          <div class="column is-half">
            <div class="field is-horizontal">
              <!-- Start Date -->
              <div class="field-body">
                <div class="field is-narrow">
                  <label class="label" for="startDate">Start Date:</label>
                  <div class="control">
                    <input class="input" type="datetime-local" id="startDate" v-model="filterData.startDate" required>
                  </div>
                </div>
                <!-- End Date -->
                <div class="field is-narrow">
                  <label class="label" for="endDate">End Date:</label>
                  <div class="control">
                    <input class="input" type="datetime-local" id="endDate" v-model="filterData.endDate" required>
                  </div>
                </div>
              </div>
            </div>
            <!-- League picklist -->
            <div class="field">
              <label class="label" for="league">Select League(s):</label>
              <div class="control">
                <div class="select is-multiple">
                  <select class="input" id="league" v-model="selectedLeagues" multiple @change="fetchOpponents">
                    <option v-for="league in leagues" :key="league._id" :value="league._id">{{ league.name }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Filter and Reset Buttons -->

        <div class="columns is-centered">
          <div class="column is-half">
            <div class="field is-grouped is-grouped-centered">
              <div class="control">
                <button class="button is-success" @click="handleFilterClick">Filter</button>
              </div>
              <div class="control">
                <button class="button is-success is-outlined" @click="resetFilters">Reset Filters</button>
              </div>
            </div>
          </div>
        </div>

      
      <!-- Table Component -->
      <section class="section">
        <!-- Conditional Rendering for Events Table or No Events Message -->
        <template v-if="filteredEvents.length > 0">
          <Table :events="filteredEvents" :is-logged-in-as-admin="isLoggedIn" @open-edit-modal="openEditModal" @delete-event="handleDeleteEvent"/>
        </template>
        <template v-else>
          <p class>No events to display.</p>
        </template>
      </section>
      
      <!-- Edit Modal -->
      <div class="modal" :class="{ 'is-active': showEditModal }">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Edit Event</p>
            <button class="delete is-responsive" aria-label="close" @click="closeEditModal"></button>
          </header>
          <section class="modal-card-body">
            <!-- Form -->
            <form @submit.prevent="submitForm">
              <!-- Type -->
              <div class="field">
                <label class="label" for="type">Type:</label>
                <div class="control">
                  <div class="select">
                    <select id="type" v-model="editFormData.type" required>
                      <option value="practice">Practice</option>
                      <option value="game">Game</option>
                      <option value="tournament">Tournament</option>
                    </select>
                  </div>
                </div>
              </div>
              <!-- Start Date -->
              <div class="field">
                <label class="label" for="startDate">Start Date:</label>
                <div class="control">
                  <input class="input" type="datetime-local" id="startDate" v-model="editFormData.startDate" required>
                </div>
              </div>
              <!-- End Date -->
              <div class="field">
                <label class="label" for="endDate">End Date:</label>
                <div class="control">
                  <input class="input" type="datetime-local" id="endDate" v-model="editFormData.endDate" required>
                </div>
              </div>
              <!-- Location -->
              <div class="field">
                <label class="label" for="location">Location:</label>
                <div class="control">
                  <input class="input" type="text" id="location" v-model="editFormData.location" required>
                </div>
              </div>
              <!-- League -->
              <div class="field">
                <label class="label" for="league">League:</label>
                <div class="control">
                  <div class="select">
                    <select id="league" v-model="editFormData.league" @change="fetchOpponents" required>
                      <option value="">Select a League</option>
                      <option v-for="league in leagues" :key="league._id" :value="league._id">{{ league.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <!-- Opponent (if applicable) -->
              <div class="field" v-if="editFormData.type !== 'tournament' && editFormData.type !== 'practice'">
                <label class="label" for="opponent">Opponent:</label>
                <div class="control">
                  <div class="select">
                    <select id="opponent" v-model="editFormData.opponent">
                      <option value="">Select an Opponent</option>
                      <option v-for="opponent in filteredOpponents" :key="opponent._id" :value="opponent._id">{{ opponent.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <!-- Submit Button -->
              <div class="field">
                <div class="control">
                  <button class="button is-success" type="submit">Update Event</button>
                </div>
              </div>
            </form>
          </section>
        </div>
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


 
<style scoped>
  .social-icons a {
  margin-right: 1.0rem; /* Adjust the margin to add more space between icons */
}
</style>