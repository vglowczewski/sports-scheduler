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
    async getTeamsByLeague(leagueId) {
      try {
        // Adjust the endpoint URL to include the leagueId as a parameter
        const response = await apiClient.get(`/leagues/${leagueId}/teams`);
        return response.data;
      } catch (error) {
        console.error('Error fetching teams by league:', error);
        throw error;
      }
    }
  };