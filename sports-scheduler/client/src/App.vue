
<template>
  <div id="layout">
    <header>
      <div class="wrapper">
        <nav>
          <!-- <Navigation /> -->
          <RouterLink to="/">Home</RouterLink> |
          <RouterLink to="/about">About</RouterLink> |
          <RouterLink to="/events">Events</RouterLink> <span v-if="isLoggedIn"> | </span>
          <RouterLink to="/addEvent" v-if="isLoggedIn">Add Event</RouterLink> <span v-if="isLoggedIn"> | </span>
          <RouterLink to="/manageLeague" v-if="isLoggedIn">Manage Leagues</RouterLink> <span v-if="!isLoggedIn"> | </span>
          <RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink>
          <button v-if="isLoggedIn" @click="logout">Logout</button>
        </nav>
      </div>
    </header>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import Navigation from '@/components/NavComponent.vue';
  
  // export default {
  //   computed: {
  //     isLoggedIn() {
        
  //       // Access the isLoggedIn state from Vuex store or local component state
  //       return this.$store.state.user.isLoggedIn; // Example for Vuex
  //     },
  //     username() {
  //       // Optionally, you can display the username if available
  //       return this.$store.state.user.username; // Example for Vuex
  //     }
  //   }
  // };

  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
import { computed } from 'vue';

const store = useStore();
const router = useRouter();

const isLoggedIn = computed(() => {
  return store.state.user.isLoggedIn;
});

const username = computed(() => {
  return store.state.user.username;
});

const logout = () => {
  // Dispatch the logout action
  store.dispatch('logoutUser')
    .then(() => {
      // Redirect to the login page after logout
      router.push('/login');
    })
    .catch(error => {
      console.error('Logout failed:', error);
      // Handle logout failure
    });
}

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
