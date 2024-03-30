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
    async getLeagues() {
      try {
        const response = await apiClient.get('/leagues/');
        console.log(response)
        return response.data;
      } catch (error) {
        console.error('Error fetching leagues:', error);
        throw error; // Re-throw the error to propagate it to the caller
      }
    },
    async addLeague(leagueData) {
      try {
        const response = await apiClient.post('/leagues/', leagueData);
        console.log("recieved by leagueservice", leagueData);
        return response.data; 
      } catch (error) {
        console.error('Failed to add league:', error);
        throw error;
      }
    },
    async deleteLeague(leagueId) {
      try {
        const response = await apiClient.delete(`/leagues/${leagueId}`);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to delete event with ID ${leagueId}: ${error.message}`);
      }
    } 
  }