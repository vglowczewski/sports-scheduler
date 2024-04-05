<!-- NavComponent.vue -->
<template>
    <nav>
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/about">About</RouterLink> |
      <RouterLink to="/events">Events</RouterLink>
      <span v-if="isLoggedIn"> | </span>
      <RouterLink to="/addEvent" v-if="isLoggedIn">Add Event</RouterLink>
      <span v-if="isLoggedIn"> | </span>
      <RouterLink to="/manageLeague" v-if="isLoggedIn">Manage Leagues</RouterLink>
      <span v-if="isLoggedIn"> | </span>
      <button v-if="isLoggedIn" @click="logout">Logout</button>
      <span v-if="!isLoggedIn"> | </span>
      <RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink>
    </nav>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import { RouterLink } from 'vue-router'
  
  const router = useRouter();
  const store = useStore();
  
  const isLoggedIn = store.getters['isLoggedIn'];
  console.log("isloggedIn", isLoggedIn)
  
  const logout = async () => {
    try {
      await store.dispatch('logoutUser');
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Failed to logout:', error);
      // Handle the logout error (e.g., display an error message to the user)
    }
  };
  </script>