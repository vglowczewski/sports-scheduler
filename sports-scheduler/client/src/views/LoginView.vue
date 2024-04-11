<template>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <section class="hero is-success is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h3 class="title has-text-black">Login</h3>
          <hr class="login-hr">
          <p class="subtitle has-text-black">Please login for Administrator Access</p>
          <div class="box">
            <figure class="avatar">
              <img src="/images/logo.jpg">
            </figure>
            <form @submit.prevent="login">
              <div class="field">
                <div class="control">
                  <input class="input is-medium" type="email" placeholder="Your Email" v-model="email" autofocus required>
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <input class="input is-medium" type="password" placeholder="Your Password" v-model="password" required>
                </div>
              </div>
              <button class="button is-block is-info is-medium is-fullwidth" :disabled="isLoading">
                <span v-if="isLoading">Loading...</span>
                <span v-else>Login</span>
                <i class="fa fa-sign-in" aria-hidden="true"></i>
              </button>
            </form>
          </div>
          <p v-if="loginError" class="has-text-danger">{{ loginError }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
  
  <script>
  import { mapActions } from 'vuex';

  export default {
    data() {
      return {
        email: '',
        password: '',
        loginError: null,
        isLoading: false
      };
    },
    methods: {
      ...mapActions(['loginUser']),
      async login() {
        try {
          this.isLoading = true;
          
          // await this.loginUser({ email: this.email, password: this.password });
          await this.$store.dispatch('loginUser', { email: this.email, password: this.password });

          // If login successful, redirect to dashboard or desired page
          this.$router.push({ name: 'home' });
        } catch (error) {
          this.loginError = 'Failed to login. Please check your credentials and try again.';
        } finally {
        this.isLoading = false;
      }
      }
    }
  };
  </script>
  
  <style scoped>
.login-hr {
  border-color: black;
}

.avatar {
  margin: 0 auto;
}

.has-text-black {
  color: black !important;
}

.has-text-grey {
  color: grey !important;
}

.has-text-danger {
  color: red !important;
}
  </style>
  