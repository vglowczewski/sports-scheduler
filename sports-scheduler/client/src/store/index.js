// store/index.js

import { createStore } from 'vuex';
import userModule from './user';
import remindersModule from './reminders';

export default createStore({
  modules: {
    user: userModule,
    reminders: remindersModule,
    // Add other modules here if you have additional Vuex modules
  }
});