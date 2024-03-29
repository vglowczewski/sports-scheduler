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
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event._id">
            <td>{{ event.league.name }}</td>
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
          </tr>
        </tbody>
      </table>
      
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits, defineProps } from 'vue';
  import EventService from '@/services/EventService.js';

  const props = defineProps({
    events: Array,
    isLoggedInAsAdmin: Boolean
  });

  const emit = defineEmits(['open-edit-modal']);

  const events = ref(props.events); //make events reactive ref cause it'll change
  console.log(events)
  const isLoggedInAsAdmin = ref(props.isLoggedInAsAdmin);
  
  //method to format the date strings
  function formatDate(date) {
      return new Date(date).toLocaleDateString(); // fix the date
  }

  //method to format the time strings
  function formatTime(date) {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); //fix the time
  }

  async function deleteEvent(eventId) {
    console.log(`Deleting event with ID: ${eventId}`);
    try {
      await EventService.deleteEvent(eventId); //use the delete event function
      console.log(`Event with ID ${eventId} deleted successfully from the backend`);
      events.value = events.value.filter(event => event._id !== eventId);
    } catch (error) {
      console.error(`Failed to delete event with ID ${eventId} from the backend:`, error);
      return; // Exit the function if there's an error
    }
  }

  function editEvent(eventId) {
    console.log(`Editing event with ID: ${eventId}`);
    emit('open-edit-modal', eventId);
  }
  </script>
  
  <style scoped>
/* Add your table styles here */
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

</style>