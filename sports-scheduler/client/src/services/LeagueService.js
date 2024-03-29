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
    async addLeagues(leagueData){
      try {
        const response = await apiClient.post('/leagues/', leagueData);
        console.log(response)
        return response.data; 
      } catch (error) {
        throw new Error('Failed to add league:', error);
      }
    } 
  }