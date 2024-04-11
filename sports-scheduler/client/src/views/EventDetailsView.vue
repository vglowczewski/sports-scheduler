<template>
  <!-- Hero Section -->
  <section class="hero is-success is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <!-- Event Details Content -->
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="event" class="event-details">
          <h2 class="title">Event Details</h2>
          <div class="columns is-centered"> <!-- Center the columns -->
            <div class="column is-half"> <!-- Set column width to half of the container -->
              <div class="card">
                <div class="card-content">
                  <p><strong>League:</strong> {{ event?.league?.name || 'Unknown' }}</p>
                  <p><strong>Type:</strong> {{ event?.type || 'Unknown' }}</p>
                  <p><strong>Date:</strong> {{ formatDate(event?.startDate) || 'Unknown' }}</p>
                  <p><strong>Start Time:</strong> {{ formatTime(event?.startDate) || 'Unknown' }}</p>
                  <p><strong>End Time:</strong> {{ formatTime(event?.endDate) || 'Unknown' }}</p>
                  <p><strong>Location:</strong> {{ event?.location || 'Unknown' }}</p>
                  <!-- Add more event details as needed -->
                </div>
              </div>
              <!-- Load GoogleMap component with event location -->
              <template v-if="event.location">
                <div class="card event-map-card"> <!-- Add a custom class for styling -->
                  <div class="card-content"> <!-- Remove height: 0; padding-bottom: 100%; position: relative; -->
                    <div class="map-wrapper"> <!-- Create a wrapper for the map component -->
                      <GoogleMap :eventLocation="event.location" class="centered-map"></GoogleMap>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

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



<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import EventService from '@/services/EventService.js';
import GoogleMap from '@/components/GoogleMap.vue'; // Import the GoogleMap component

// Define event as a ref
const event = ref(null);
const loading = ref(true);

// Access the route parameter 'id'
const route = useRoute();
const eventId = route.params.id;

// Fetch event data based on the eventId
onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const eventData = await EventService.getEventById(eventId);
    event.value = eventData;
    console.log("event", event.value)
  } catch (error) {
    console.error('Error fetching event data:', error);
  } finally {
    loading.value = false; // Set loading to false once data is fetched
  }
});

// Method to format the date strings
function formatDate(dateString) {
  console.log("date", dateString)
  const date = new Date(dateString).toISOString().slice(0, 10); // Slice to get only the date part
  return date;
}

// Method to format the time strings
function formatTime(dateString) {
  const options = { hour12: true, hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }; // Adjust timezone as needed
  const time = new Date(dateString).toLocaleTimeString(undefined, options); // Format time with options
  return time;
}
</script>
<style scoped>
/* Add your event details view styles here */
.event-map-card {
  /* Adjust card width and margin as needed */
  width: 100%;
  margin-top: 20px;
  overflow: hidden; /* Hide overflow to prevent scrollbars */
  border-radius: 8px; /* Optional: Add border-radius for aesthetics */
}
.map-wrapper {
  /* Set map-wrapper height to a desired value */
  height: 400px; /* Adjust as needed */
  display: flex;
  justify-content: center;
  align-items: center;
}
.centered-map {
  width: 100%;
  height: 100%;
}
</style>