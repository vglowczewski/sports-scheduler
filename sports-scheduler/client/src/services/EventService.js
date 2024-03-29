import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://mevn-0spf.onrender.com',
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
   
  export default {
    async getEvents() {
      try {
        const response = await apiClient.get('/events/');
        return response.data;
      } catch (error) {
        console.error('Error fetching events:', error);
        throw error; //error 
      }
    },
    async deleteEvent(eventId) {
      try {
        const response = await apiClient.delete(`/events/${eventId}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to delete event with ID ${eventId}: ${error.message}`);
      }
    } 
  }
  