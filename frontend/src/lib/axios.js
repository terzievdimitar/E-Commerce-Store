import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
	baseURL,
	withCredentials: true,
});

export default axiosInstance;
