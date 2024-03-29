import { createRouter, createWebHistory } from 'vue-router'
import EventListView from '../views/EventListView.vue'
import EventDetailsView from '../views/EventDetailsView.vue'
import AddEventView from '../views/AddEventView.vue'
import LeagueManageView from '../views/LeagueManageView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'event-list',
      component: EventListView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/event/:id',
      name: 'event-details',
      component: EventDetailsView,
    },
    {
      path: '/addEvent',
      name: 'add-event',
      component: AddEventView,
    },
    {
      path: '/manageLeague',
      name: 'manage-league',
      component: LeagueManageView,
    }
  ]
})

export default router
