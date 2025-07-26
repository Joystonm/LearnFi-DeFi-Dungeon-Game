import axios from 'axios';

// Create a custom axios instance with default configuration
const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default axiosInstance;
