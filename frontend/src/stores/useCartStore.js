import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from '../lib/axios';

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,

	getCartItems: async () => {
		try {
			const response = await axios.get('/cart');
			set({ cart: response.data });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response?.data?.error || 'Failed to fetch cart items');
		}
	},

	addToCart: async (product) => {
		try {
			await axios.post('/cart', { productId: product._id });
			toast.success('Product added to cart', { id: 'add-to-cart' });

			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === product._id);
				const newCart = existingItem
					? prevState.cart.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart: newCart };
			});
			get().calculateTotals();
		} catch (error) {
			toast.error(error.response.data.message || 'An error occurred');
		}
	},

	// utility funnction to calculate totals
	calculateTotals: () => {
		const { cart, coupon } = get();

		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discount / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
}));
