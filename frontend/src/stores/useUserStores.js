import { create } from 'zustand';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error('Passwords do not match');
		}

		try {
			const response = await axios.post('/auth/signup', { name, email, password });
			set({ user: response.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || 'Signup failed');
		}
	},

	login: async ({ email, password }) => {
		set({ loading: true });

		try {
			const response = await axios.post('/auth/login', { email, password });
			set({ user: response.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || 'Login failed');
		}
	},

	logout: async () => {
		try {
			await axios.post('/auth/logout');
			set({ user: null });
			toast.success('Logged out successfully');
		} catch (error) {
			toast.error(error.response?.data?.message || 'Logout failed');
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });

		try {
			const response = await axios.get('/auth/profile');
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			set({ user: null, checkingAuth: false });
		}
	},
}));

// todo: implement axios interceptors for auth token management
