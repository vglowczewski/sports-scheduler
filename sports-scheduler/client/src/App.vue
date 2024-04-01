<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <div id="layout">
    <header>
      <div class="wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink> |
          <RouterLink to="/events">Events</RouterLink> |
          <RouterLink to="/about">About</RouterLink> <span v-if="isLoggedIn"> | </span>
          <RouterLink to="/addEvent" v-if="isLoggedIn">Add Event</RouterLink> <span v-if="isLoggedIn"> | </span>
          <RouterLink to="/manageLeague" v-if="isLoggedIn">Manage Leagues</RouterLink> <span v-if="!isLoggedIn"> | </span>
          <RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink>
        </nav>
      </div>
    </header>
    <RouterView />
  </div>
</template>

<script>
  
  export default {
    computed: {
      isLoggedIn() {
        
        // Access the isLoggedIn state from Vuex store or local component state
        return this.$store.state.user.isLoggedIn; // Example for Vuex
      },
      username() {
        // Optionally, you can display the username if available
        return this.$store.state.user.username; // Example for Vuex
      }
    }
  };
</script>

<style scoped>
#layout {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
nav {
  padding: 30px;
}
nav a {
  font-weight: bold;
  color: #2c3e50;
}
nav a.router-link-exact-active {
  color: #42b983;
}
</style>
