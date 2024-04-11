<template>
  <div id="layout">
    <header>
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <RouterLink class="navbar-item" to="/">BVG Athletics</RouterLink>
          <!-- Navbar burger -->
          <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" @click="toggleMenu">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <!-- Navbar menu -->
        <div :class="{ 'navbar-menu': true, 'is-active': isMenuOpen }">
          <div class="navbar-start">
            <RouterLink class="navbar-item" to="/events">Events</RouterLink>
            <RouterLink v-if="isLoggedIn" class="navbar-item" to="/addEvent">Add Event</RouterLink>
            <RouterLink v-if="isLoggedIn" class="navbar-item" to="/manageLeague">Manage Leagues</RouterLink>
            <RouterLink v-if="!isLoggedIn" class="navbar-item" to="/login">Login</RouterLink>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <RouterLink v-if="!isLoggedIn" class="button is-light" to="/login">Log in</RouterLink>
                <button v-if="isLoggedIn" class="button is-danger" @click="logout">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

import 'bulma/css/bulma.min.css';

import { ref } from 'vue';

const store = useStore();
const router = useRouter();

const isLoggedIn = computed(() => {
  return store.state.user.isLoggedIn;
});
const username = computed(() => {
  return store.state.user.username;
});



const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

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
};
</script>

<style scoped>
nav a.router-link-exact-active {
  color: #42b983;
}
</style>
