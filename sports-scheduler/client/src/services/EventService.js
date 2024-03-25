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
        throw error; // Re-throw the error to propagate it to the caller
      }
    } 
  }
  