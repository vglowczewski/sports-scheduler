<template>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>League</th>
            <th>Type</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Location</th>
            <th>Opponent</th>
            <th>Notes</th>
            <th v-if="isLoggedInAsAdmin">Actions</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event._id" @mouseover="event.hovered = true" @mouseleave="event.hovered = false">
            <td >{{ event.league ? event.league.name : 'Unknown' }}</td>
            <td>{{ event.type }}</td>
            <td>{{ formatDate(event.startDate) }}</td>
            <td>{{ formatTime(event.startDate) }}</td>
            <td>{{ formatTime(event.endDate) }}</td>
            <td>{{ event.location }}</td>
            <td>{{ event.opponent ? event.opponent.name : ' ' }}</td>
            <td>{{ event.notes }}</td>
            <td v-if="isLoggedInAsAdmin" class="actions-column">
              <button @click="editEvent(event._id)">Edit</button>
              <button @click="deleteEvent(event._id)">Delete</button>
            </td>
            <td v-if="event.hovered" class="details-column">
              <button @click="goToDetails(event._id)" class="details-button">Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
import { useRouter } from 'vue-router';
import { ref, defineProps, defineEmits, computed } from 'vue';
import EventService from '@/services/EventService.js';

const props = defineProps({
  events: Array,
  isLoggedInAsAdmin: Boolean
});

const hoveredEventId = ref(null);
const router = useRouter();


const emit = defineEmits(['open-edit-modal']);

function goToDetails(eventId) {
  router.push({ path: `/event/${eventId}` }); // Use your actual route name and parameters
}

// Use a computed property to derive filteredEvents from props.events
const filteredEvents = computed(() => props.events);
  
  // Method to format the date strings
  function formatDate(date) {
    return new Date(date).toLocaleDateString();
  }
  
  // Method to format the time strings
  function formatTime(date) {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  async function deleteEvent(eventId) {
    console.log(`Deleting event with ID: ${eventId}`);
    try {
      await EventService.deleteEvent(eventId);
      console.log(`Event with ID ${eventId} deleted successfully from the backend`);
      emit('delete-event', eventId); // Emit an event to notify the parent component to update events
    } catch (error) {
      console.error(`Failed to delete event with ID ${eventId} from the backend:`, error);
      return;
    }
  }
  
  function editEvent(eventId) {
    console.log(`Editing event with ID: ${eventId}`);
    emit('open-edit-modal', eventId);
  }
  </script>
  
  <style scoped>
.table-container {
  position: relative; /* Ensure proper positioning of the button */
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

/* Hover effect for rows */
tr:hover {
  background-color: #e0e0e0; /* Darker shade for hover */
}

.actions-column button, .details-column button {
  display: inline-block;
  margin-right: 5px;
  cursor: pointer;
  background-color: #007BFF; /* Button background color */
  color: white; /* Button text color */
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
}

.actions-column button:hover, .details-column button:hover {
  background-color: #0056b3; /* Darker shade for button hover */
}
  </style>