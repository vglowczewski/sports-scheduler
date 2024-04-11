<template>
  <!-- Hero Section -->
  <section class="hero is-success">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">Add Event</h1>
        </div>
      </div>
  </section>
  <div class="container">
    <div class="box hero is-fullheight is-justify-content-center">
      <form @submit.prevent="submitForm">
        <div class="columns is-centered">
          <div class="column is-half">
            <!-- Type -->
            <div class="field">
              <label class="label">Type:</label>
              <div class="control">
                <div class="select">
                  <select v-model="formData.type" required @change="handleTypeChange">
                    <option value="">Select Type</option>
                    <option value="practice">Practice</option>
                    <option value="game">Game</option>
                    <option value="tournament">Tournament</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Start Date and End Date -->
            <div class="field is-horizontal">
              <div class="field-body">
                <!-- Start Date -->
                <div class="field">
                  <label class="label">Start Date:</label>
                  <div class="control">
                    <input class="input" type="datetime-local" v-model="formData.startDate" required>
                  </div>
                </div>
                <!-- End Date -->
                <div class="field">
                  <label class="label">End Date:</label>
                  <div class="control">
                    <input class="input" type="datetime-local" v-model="formData.endDate" required>
                  </div>
                </div>
              </div>
            </div>

            <!-- Location -->
            <div class="field">
              <label class="label">Location:</label>
              <div class="control">
                <input class="input" type="text" v-model="formData.location" required>
              </div>
            </div>

            <!-- League -->
            <div class="field">
              <label class="label">League:</label>
              <div class="control">
                <div class="select">
                  <select v-model="formData.league" @change="fetchOpponents" required>
                    <option value="">Select a League</option>
                    <option v-for="league in leagues" :key="league._id" :value="league._id">{{ league.name }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Opponent (if applicable) -->
            <div class="field" v-if="formData.type !== 'tournament' && formData.type !== 'practice'">
              <label class="label">Opponent:</label>
              <div class="control">
                <div class="select">
                  <select v-model="formData.opponent" required>
                    <option value="">Select an Opponent</option>
                    <option v-for="opponent in filteredOpponents" :key="opponent._id" :value="opponent._id">{{ opponent.name }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="field">
              <label class="label">Notes:</label>
              <div class="control">
                <input class="input" type="text" v-model="formData.notes">
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="columns is-centered">
        <div class="field">
          <div class="control">
            <button class="button is-success" type="submit">Submit</button>
          </div>
        </div>
      </div>

      </form>

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
</template>




  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import LeagueService from '@/services/LeagueService.js';
  import TeamService from '@/services/TeamService.js';
  import EventService from '@/services/EventService.js';
    
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

    const submitForm = async () => {
  // Assuming formData.value contains the form data
  if (formData.value.opponent === '') {
    delete formData.value.opponent;
  }
  try {
    const responseData = await EventService.createEvent(formData.value);
    console.log('Data posted successfully:', responseData);
    // Clear the form data after successful submission
    formData.value = {
      type: '',
      startDate: '',
      endDate: '',
      location: '',
      opponent: '',
      league: '',
      notes: '',
    };
  } catch (error) {
    console.error('Error posting data:', error);
  }
};

        // Function to handle type change and reset opponent field for tournaments
    const handleTypeChange = () => {
      if (formData.value.type === 'tournament' || formData.value.type === 'practice') {
        formData.value.opponent = ''; // Reset opponent field if type is tournament
      }
    };

    return { leagues, teams, formData, fetchOpponents, filteredOpponents, submitForm, handleTypeChange };
  }
};
  </script>
 
<style scoped>

.social-icons a {
  margin-right: 1.0rem; /* Adjust the margin to add more space between icons */
}

</style>