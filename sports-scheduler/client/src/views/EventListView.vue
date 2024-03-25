<script setup>
import { ref, onMounted } from 'vue';
import Table from '@/components/TableComponent.vue';
import EventService from '@/services/EventService.js'

//events variable starts empty
const events = ref([]);

onMounted(async () => {
  // Fetch events data from eventservice
  try {
    const eventData = await EventService.getEvents();
    events.value = eventData;
    console.log(eventData)
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }
});
</script>

<template>
  <div>
    <h1>Events List</h1>
  </div>
</template>
 
<style scoped>
</style>