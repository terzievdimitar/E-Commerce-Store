import Product from '../models/product.model.js';

export const getCartItems = async (req, res) => {
	try {
		const products = await Product.find({ _id: { $in: req.user.cartItems } });

		// add quantity to each product in the cart

		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			return {
				...product.toObject(),
				quantity: item ? item.quantity : 1, // Default to 1 if not found
			};
		});

		res.status(200).json(cartItems);
	} catch (error) {
		console.log('Error in getCartItems controller:', error);
		res.status(500).json({ message: 'Failed to fetch cart items' });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		const existingItem = user.cartItems.find((item) => item.productId === productId);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push({ productId, quantity: 1 });
		}

		await user.save();
		res.status(201).json(user.cartItems);
	} catch (error) {
		console.log('Error in addToCart controller:', error);
		res.status(500).json({ message: 'Failed to add item to cart' });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item.productId !== productId);
		}
		await user.save();
		res.status(200).json(user.cartItems);
	} catch (error) {
		console.log('Error in removeAllFromCart controller:', error);
		res.status(500).json({ message: 'Failed to remove items from cart' });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;

		const user = req.user;

		const existingItem = user.cartItems.find((item) => item.productId === productId);

		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => productId !== item.productId);
				await user.save();
				return res.json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.status(200).json(user.cartItems);
		} else {
			res.status(404).json({ message: 'Item not found in cart' });
		}
	} catch (error) {
		res.status(500).json({ message: 'Failed to update item quantity' });
	}
};
