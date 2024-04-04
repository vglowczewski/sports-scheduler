<template>
    <div class="">
      <h1>Event Details View</h1>
    </div>
    <div v-if="event">
      <h1> {{ event.type }}</h1>
    </div>
</template>
  
<script setup>
import {ref, onMounted} from 'vue';
import EventService from '@/services/EventService.js';

const props = defineProps({
  id: {
    required: true,
  },
})

const event = ref(null);

onMounted(() => {
  EventService.getEventById(props.id)
    .then((response) => {
      event.value = response.data
    })
    .catch((error) => {
      console.log(error)
    })
})
</script>

<style>
</style>
  