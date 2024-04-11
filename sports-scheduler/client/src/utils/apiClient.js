// src/utils/apiClient.js
import axios from 'axios';
import { setAuthToken } from './auth';

const apiClient = axios.create({
  baseURL: 'https://mevn-0spf.onrender.com',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

// Use request interceptor to set auth token
apiClient.interceptors.request.use(config => {
  setAuthToken(apiClient);
  return config;
}, error => Promise.reject(error));

export default apiClient;
