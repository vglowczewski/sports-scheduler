import apiClient from '@/utils/apiClient';

   
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
    },
      // Fetches a single event by its ID
    async getEventById(eventId) {
      try {
      const response = await apiClient.get(`/events/${eventId}`);
       return response.data
      } catch (error) {
        console.error(`Error fetching event with ID ${eventId}:`, error);
        throw error; // rethrow
      }
    },
    async updateEvent(eventId, eventData) {
      try {
        const response = await apiClient.put(`/events/${eventId}`, eventData);
        return response.data; // Assuming the server responds with the updated event data
      } catch (error) {
        console.error(`Error updating event with ID ${eventId}:`, error);
        throw error; // Rethrow the error to handle it in the calling context
      }
    }, 
    async createEvent(formData) {
      try {
        console.log("form data", formData)
        const response = await apiClient.post('/events/', formData);
        return response.data;
      } catch (error) {
        throw new Error('Error creating event: ' + error.response.data.message);
      }
    },
  }
  