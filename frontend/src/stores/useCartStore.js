import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from '../lib/axios';

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	//! Cart actions

	getCartItems: async () => {
		try {
			const response = await axios.get('/cart');
			set({ cart: response.data });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
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

	removeFromCart: async (productId) => {
		await axios.delete(`/cart`, { data: { productId } });
		set((prevState) => ({
			cart: prevState.cart.filter((item) => item._id !== productId),
		}));
		get().calculateTotals();
		toast.success('Product removed from cart', { id: 'remove-from-cart' });
	},

	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			return get().removeFromCart(productId);
		}

		await axios.put(`/cart/${productId}`, { quantity });
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
		}));

		get().calculateTotals();
	},

	clearCart: async () => {
		await axios.delete('/cart', { data: {} }); // No productId, so clears all
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
	},

	//! Coupon actions

	getMyCoupon: async () => {
		try {
			const response = await axios.get('/coupon');
			set({ coupon: response.data });
		} catch (error) {
			console.error('Failed to fetch coupon:', error);
			set({ coupon: null, isCouponApplied: false });
		}
	},

	applyCoupon: async (couponCode) => {
		try {
			const response = await axios.post('/coupon/validate', { code: couponCode });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success('Coupon applied successfully', { id: 'apply-coupon' });
		} catch (error) {
			toast.error(error.response.data.message || 'Failed to apply coupon');
		}
	},

	removeCoupon: async () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success('Coupon removed', { id: 'remove-coupon' });
	},

	//! utility funnction to calculate totals
	calculateTotals: () => {
		const { cart, coupon } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
}));
