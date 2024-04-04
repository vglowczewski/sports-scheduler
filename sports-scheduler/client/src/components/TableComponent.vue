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
          </tr>
        </tbody>
      </table>
      
    </div>
  </template>
  
  <script setup>
import { defineProps, defineEmits, computed } from 'vue';
import EventService from '@/services/EventService.js';

const props = defineProps({
  events: Array,
  isLoggedInAsAdmin: Boolean
});

const emit = defineEmits(['open-edit-modal']);

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