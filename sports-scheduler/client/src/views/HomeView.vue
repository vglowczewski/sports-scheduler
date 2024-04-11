<template>
  <div>
    <!-- Image Section -->
    <section class="hero">
      <figure class="image" style="position: relative;">
        <!-- Displaying text over the image -->
        <p style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 5rem; font-weight: bold;">BVG Athletics</p>
        <img src="/images/about.jpg">
      </figure>
    </section>

    <!-- Main Content Sections -->
    <section class="section">
        <div class="container has-text-centered">
            <h2 class="title">Athletics at Bayview Glen</h2>
            <p>All students from Grades 3 to 12 are encouraged to try out and participate Gryphon teams. Participation is at least one sport per year is mandatory in grades 3 - 5, and is strongly encouraged in the Prep and Upper Schools. Last year, 90% of our students were involved in Gryphons Athletics. Please refer to the school website and back to school mailing for more details regarding our team offerings.
            <br> <br> Our varied programmes provide unlimited opportunities for the aspiring athlete. The School mascot, the mighty Gryphon – representing speed and majesty with its body of a lion and head of an eagle – symbolizes the combining of intelligence with strength and a positive attitude. At Bayview Glen we have a positive, spirited, high-energy, competitive athletic team environment. We teach and coach our students to uphold the values of athletic integrity, hard work, team comradery, dedication and commitment. </p>

            <div class="columns is-centered is-multiline" style="padding: 2rem">
          <div class="column is-half-desktop is-full-mobile">
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">Mission Statement</p>
                  </div>
                </div>

                <div class="content">
                  Our mission is to promote the values of teamwork, leadership, competition, athletic integrity, respect and honouring the game and to offer the necessary experience required to build confidence towards pursuing a healthy active lifestyle.
                </div>
              </div>
            </div>
          </div>
          <div class="column is-half-desktop is-full-mobile">
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">Sports Teams</p>
                  </div>
                </div>

                <div class="content">
                  Our Gryphons athletes compete at many different levels in the Conference of Independent Schools’ Athletic Association (CISAA), a group of independent schools across Ontario, from St. Catharine’s to Rousseau Lake to Belleville. There are three athletic terms and students may compete on one team per term. 
                </div>
              </div>
            </div>
          </div>
          <div class="column is-half-desktop is-full-mobile">
            <div class="card is-success">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">Athletics Schedules</p>
                  </div>
                </div>

                <div class="content">
                  View our athletics schedules and stay updated on upcoming events. We make keeping up with practices, games, and tournaments easy! Click the button below to explore the upcoming events.
                  <br>
                  <br>
                  <router-link to="/events" class="button is-success">View Events</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
    </section>


      <!-- Social Links -->
      <footer class="footer">
    <div class="content has-text-centered">
      <p class="social-icons">
        <a href="#"><span style="color: #48C774;"><i class="fab fa-facebook fa-lg"></i></span></a>
      <a href="#"><span style="color: #48C774;"><i class="fab fa-twitter fa-lg"></i></span></a>
      <a href="#"><span style="color:#48C774;"><i class="fab fa-instagram fa-lg"></i></span></a>
      <a href="#"><span style="color: #48C774;"><i class="fab fa-youtube fa-lg"></i></span></a>
      </p>
      <p>
        <strong>Bayview Glen Independent School</strong> &copy; 2024. All rights reserved.
      </p>
    </div>
  </footer>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.columns.is-centered {
  display: flex;
  justify-content: center;
}

.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

  .social-icons a {
  margin-right: 1.0rem; /* Adjust the margin to add more space between icons */
}

</style>
