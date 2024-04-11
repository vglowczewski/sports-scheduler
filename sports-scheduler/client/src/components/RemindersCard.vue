<template>
    <div class="phone-container">
        <!-- Phone number input form -->
        <h3>Set Phone Number</h3>
        <form @submit.prevent="submitPhoneNumber">
            <label for="phoneNumber">Phone Number:</label>
            <input type="tel" id="phoneNumber" v-model="phoneNumber" required>
            <button type="submit">Save</button>
        </form>
    </div>
    <div class="reminders-container">
        <h2>Reminders</h2>
      <div class="reminder-card" v-for="reminder in reminders" :key="reminder.id">
        <div class="card-header">
          <h3>Reminder</h3>
        </div>
        <div class="card-body">
          <p><strong>League:</strong> {{ reminder.league }}</p>
          <p><strong>Type:</strong> {{ reminder.type }}</p>
          <p><strong>Date:</strong> {{ reminder.startDate }}</p>
          <!-- Add more details as needed -->
        </div>
      </div>
</div>
</template>

<script setup>
import { useStore } from 'vuex';

const store = useStore();

// Access the reminders array directly from Vuex store state
const reminders = store.state.reminders.reminders;
</script>

<style scoped>
.reminders-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.reminder-card {
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
}

.phone-container {
    margin-bottom: 20px;
}

.card-header {
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  padding-bottom: 10px;
}

.card-header h3 {
  margin: 0;
}

.card-body p {
  margin: 0;
  margin-bottom: 10px;
}
</style>