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
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
      events: {
          type: Array,
          required: true,
      }
  });
  
  //method to format the date strings
  function formatDate(date) {
      return new Date(date).toLocaleDateString(); // fix the date
  }

  //method to format the time strings
  function formatTime(date) {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); //fix the time
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
</style>