// src/utils/auth.js

// Function to retrieve the token from local storage
export const getToken = () => localStorage.getItem('token');

// Function to set the Authorization header for axios
export const setAuthToken = (apiClient) => {
  const token = getToken();
  console.log("token", token)
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};
