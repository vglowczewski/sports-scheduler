
<template>
  <div class="table-container">
    <table class="table is-bordered is-hoverable is-fullwidth">
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
          <!-- <th>Reminders</th> -->
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="event in paginatedEvents" :key="event._id">
          <td>{{ event.league ? event.league.name : 'Unknown' }}</td>
          <td>{{ event.type }}</td>
          <td>{{ formatDate(event.startDate) }}</td>
          <td>{{ formatTime(event.startDate) }}</td>
          <td>{{ formatTime(event.endDate) }}</td>
          <td>{{ event.location }}</td>
          <td>{{ event.opponent ? event.opponent.name : '' }}</td>
          <td>{{ event.notes }}</td>
          <td v-if="isLoggedInAsAdmin" class="actions-column">
            <span class="icon-clickable"@click="editEvent(event._id)">
                <i class="fas fa-edit"></i>
              </span>
              <span class="icon-clickable" @click="deleteEvent(event._id)">
                <i class="fas fa-trash"></i>
              </span>
          </td>
          <!-- <td>
            <button class="button is-primary" @click="addToReminders(event)">+</button>
          </td> -->
          <td class="details-column">
            <button class="button is-success" @click="goToDetails(event._id)">Details</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!--Pagination-->
    <nav class="pagination is-centered" role="navigation" aria-label="pagination">
      <a href="#" class="pagination-previous is-success" :class="{'disabled': currentPage === 1}" @click.prevent="changePage(currentPage - 1)">Previous</a>
      <a href="#" class="pagination-next is-success" :class="{'disabled': currentPage === totalPages}" @click.prevent="changePage(currentPage + 1)">Next page</a>
      <!-- Consider adding dynamic pagination links if needed -->
      <ul class="pagination-list">
    <li v-for="page in pages" :key="page">
      <a href="#" class="pagination-link" :class="{'is-current': page === currentPage}" @click.prevent="changePage(page)">
        {{ page }}
      </a>
    </li>
  </ul>
    </nav>
  </div>
</template>
  
  <script setup>
import { useRouter } from 'vue-router';
import { ref, defineProps, defineEmits, computed } from 'vue';
import EventService from '@/services/EventService.js';
import { useStore } from 'vuex';

const props = defineProps({
  events: Array,
  isLoggedInAsAdmin: Boolean
});

const hoveredEventId = ref(null);
const router = useRouter();
const store = useStore(); 
const currentPage = ref(1);
const pageSize = 10; // Or any other number that suits your design
// Computed property to calculate the total number of pages
const totalPages = computed(() => Math.ceil(props.events.length / pageSize));

const pages = computed(() => {
  const range = (start, end) => Array.from({ length: (end - start) + 1 }, (v, k) => k + start);
  const total = totalPages.value, current = currentPage.value, delta = 2;
  const left = current - delta, right = current + delta + 1;
  const result = range(1, total).filter(page => page === 1 || page === total || (page >= left && page < right));

  return result.reduce((acc, page, index, arr) => {
    if (index && page - arr[index - 1] === 2) {
      acc.push(page - 1);
    } else if (index && page - arr[index - 1] !== 1) {
      acc.push('...');
    }
    acc.push(page);
    return acc;
  }, []);
});

// Computed property to get the events for the current page
const paginatedEvents = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return props.events.slice(startIndex, endIndex);
});

// Method to change the current page
function changePage(page) {
  if (page < 1 || page > totalPages.value) {
    return; // Prevent changing to a non-existent page
  }
  currentPage.value = page;
}

// const reminders = ref([]);


// function addToReminders(event) {
//   store.dispatch('addReminder', event); // Dispatch action to add reminder
//   console.log('Event added to reminders successfully.');
// }

const emit = defineEmits(['open-edit-modal', 'delete-event']);

function goToDetails(eventId) {
  router.push({ path: `/event/${eventId}` }); // Use your actual route name and parameters
}

// Use a computed property to derive filteredEvents from props.events
const filteredEvents = computed(() => props.events);
  
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
  
  async function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')){
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
  }
  
  function editEvent(eventId) {
    console.log(`Editing event with ID: ${eventId}`);
    emit('open-edit-modal', eventId);
  }
  </script>
  
<style scoped>
.table-container {
  overflow-x: auto;
}

.pagination-previous.disabled, .pagination-next.disabled {
  background-color: #48c774 !important; /* Bulma's green */
  border-color: #48c774 !important;
  color: white !important;
  opacity: 0.5; /* Optional: Lower opacity to indicate it's disabled, adjust as needed */
}

.pagination-previous.disabled:hover, .pagination-next.disabled:hover {
  background-color: #48c774 !important; /* Maintain the same color on hover */
  border-color: #48c774 !important;
}
  </style>