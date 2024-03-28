<script setup>
import { ref, onMounted } from 'vue';
import Table from '@/components/TableComponent.vue';
import EventService from '@/services/EventService.js'

//events variable starts empty
const events = ref([]);
const isLoggedInAsAdmin = ref(true); // Assuming the user is logged in as admin initially

onMounted(async () => {
  console.log("fetching events")
  // Fetch events data from eventservice
  try {
    const eventData = await EventService.getEvents();
    events.value = eventData; //issue here
    console.log("events fetched")
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }
  // checkAdminStatus();
});
</script>

<template>
  <div>
    <h1>Events List</h1>
    <Table :events="events" :is-logged-in-as-admin="isLoggedInAsAdmin"/>
  </div>
</template>
 
<style scoped>
</style>