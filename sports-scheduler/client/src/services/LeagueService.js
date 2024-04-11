import apiClient from '@/utils/apiClient';
   
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
        console.log("response data", response.data)
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
    } ,
    async updateLeague(leagueId, leagueData) {
      try {
        const response = await apiClient.put(`/leagues/${leagueId}`, leagueData);
        return response.data;
      } catch (error) {
        console.error(`Error updating league with ID ${leagueId}:`, error);
        throw error; // Rethrow the error to handle it in the calling context
      }
    }, 
  }