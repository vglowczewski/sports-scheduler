<template>
  <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="event" class="event-details">
      <h2>Event Details</h2>
    <p><strong>League:</strong> {{ event?.league?.name || 'Unknown' }}</p>
    <p><strong>Type:</strong> {{ event?.type || 'Unknown' }}</p>
    <p><strong>Date:</strong> {{ formatDate(event?.startDate) || 'Unknown' }}</p>
    <p><strong>Start Time:</strong> {{ formatTime(event?.startDate) || 'Unknown' }}</p>
    <p><strong>End Time:</strong> {{ formatTime(event?.endDate) || 'Unknown' }}</p>
    <p><strong>Location:</strong> {{ event?.location || 'Unknown' }}</p>
    <!-- Add more event details as needed -->
    <!-- Load GoogleMap component with event location -->
    <template v-if="event.location">
      <GoogleMap :eventLocation="event.location"></GoogleMap>
    </template>
  </div>
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

// Method to format date
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '';

// Method to format time
const formatTime = (date) => date ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
</script>

<style scoped>
/* Add your event details view styles here */
.event-details {
  /* Your styles */
}
</style>