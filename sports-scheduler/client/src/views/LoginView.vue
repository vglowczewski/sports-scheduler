<template>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  
  const email = ref('');
  const password = ref('');
  const errorMessage = ref(null);
  const successMessage = ref(null);
  
  const store = useStore();
  const router = useRouter();
  
  const login = async () => {
    try {
      await store.dispatch('loginUser', { email: email.value, password: password.value });
      // If login successful
      successMessage.value = 'Login successful!';
      errorMessage.value = null; // Clear any previous error message
      // Clear input fields
      email.value = '';
      password.value = '';
      // Redirect to dashboard or desired page after a delay (for UX)
      setTimeout(() => {
        router.push({ name: 'home' });
      }, 1000);
    } catch (error) {
      successMessage.value = null; // Clear any previous success message
      errorMessage.value = 'Failed to login. Please check your credentials and try again.';
      console.error('Login failed:', error);
    }
  };
  </script>
  
  <style scoped>
  /* Styles */
  </style>
  