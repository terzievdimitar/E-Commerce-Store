import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from '../lib/axios';

export const useProductStore = create((set, get) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),

	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post('/products', productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
			toast.success('Product created');
		} catch (error) {
			toast.error(error.response.data.error || 'Failed to create product');
			set({ loading: false });
		}
	},

	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get('/products');
			set({ products: response.data.products, loading: false });
		} catch (error) {
			toast.error(error.response.data.error || 'Failed to fetch products');
			set({ error: 'Failed to fetch products', loading: false });
		}
	},

	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: 'Failed to fetch products', loading: false });
			toast.error(error.response.data.error || 'Failed to fetch products');
		}
	},

	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
			toast.success(`Product deleted`);
		} catch (error) {}
	},

	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			set((state) => ({
				products: state.products.map((product) => (product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product)),
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error || 'Failed to toggle featured status');
			set({ loading: false });
		}
	},

	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get('/products/featured');
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: 'Failed to fetch featured products', loading: false });
		}
	},
}));
