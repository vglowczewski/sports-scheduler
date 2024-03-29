<script setup>
import { ref, onMounted } from 'vue';
import Table from '@/components/TableComponent.vue';
import EditModal from '@/components/EditModal.vue';
import EventService from '@/services/EventService.js'

//events variable starts empty
const events = ref([]);
const isLoggedInAsAdmin = ref(true); // Assuming the user is logged in as admin initially
const showEditModal = ref(false);
const selectedEventId = ref(''); // To store the ID of the event being edited

onMounted(async () => {
  console.log("fetching events")
  // Fetch events data from eventservice
  try {
    const eventData = await EventService.getEvents();
    events.value = eventData;
    console.log("events fetched")
    console.log(events)
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }
});

function openEditModal(eventId) {
  console.log("Opening edit modal for event with ID:", eventId);
  selectedEventId.value = eventId; // Set the selected event ID
  showEditModal.value = true; // Show the modal
  console.log("Modal show status:", showEditModal.value);
  console.log("Selected Event Id", selectedEventId.value)
}

function closeEditModal() {
  console.log("Closing edit modal");
  showEditModal.value = false;
}

</script>

<template>
    <div>
    <h1>Events List</h1>
    <!-- Conditionally render the TableComponent so it's not empty -->
    <div v-if="events.length > 0">
      <Table :events="events" :is-logged-in-as-admin="isLoggedInAsAdmin" @open-edit-modal="openEditModal"/>
    </div>
    <div v-else>
      <!-- Display a loading indicator or message -->
      <p>Loading Events...</p>
    </div>
    <EditModal :show="showEditModal" :eventId="selectedEventId" @close="closeEditModal"/>
  </div>
</template>
 
<style scoped>
</style>