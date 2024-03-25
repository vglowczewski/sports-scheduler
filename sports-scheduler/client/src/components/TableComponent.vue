<template>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Location</th>
            <!-- <th>Teams</th>
            <th>League</th> -->
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event._id">
            <td>{{ event.type }}</td>
            <td>{{ formatDate(event.startDate) }}</td>
            <td>{{ formatDate(event.endDate) }}</td>
            <td>{{ event.location }}</td>
            <!-- <td>{{ event.teams.join(', ') }}</td> -->
            <!-- <td>{{ event.league }}</td> -->
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