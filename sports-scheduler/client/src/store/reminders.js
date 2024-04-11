// store/reminders.js
export default {
    state: {
      reminders: []
    },
    mutations: {
      addReminder(state, reminder) {
        state.reminders.push(reminder);
      }
    },
    actions: {
      addReminder({ commit }, reminder) {
        commit('addReminder', reminder);
      }
    },
    getters: {
      reminders(state) {
        return state.reminders;
      }
    }
  };