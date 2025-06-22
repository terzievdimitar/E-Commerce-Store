import cloudinary from '../lib/cloudinary.js';
import { redis } from '../lib/redis.js';
import Product from '../models/product.model.js';

export const getAllProducts = async (_, res) => {
	try {
		const products = await Product.find({});
		res.status(200).json({ products });
	} catch (error) {
		console.error('Error fetching products:', error);
		res.status(500).json({
			message: 'Error fetching products',
			error: error.message,
		});
	}
};

export const getFeaturedProducts = async (_, res) => {
	try {
		let featuredProducts = await redis.get('featured_products');
		if (featuredProducts) {
			// If featured products are cached, return them
			return res.status(200).json(JSON.parse(featuredProducts));
		}

		// If not cached, fetch from the database
		// .lean() is used to return plain JavaScript objects instead of MongoDB documents
		// which is more efficient for read operations (performance optimization)
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: 'No featured products found' });
		}

		// Cache the featured products

		await redis.set('featured_products', JSON.stringify(featuredProducts)); // Cache for 1 hour

		res.json(featuredProducts);
	} catch (error) {
		console.error('Error fetching featured products:', error);
		res.status(500).json({ message: 'Error fetching featured products', error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: 'products' });
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : '',
			category,
		});

		res.status(201).json(product);
	} catch (error) {
		console.log('Error in createProduct controller', error.message);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Delete product image from Cloudinary if it exists

		if (product.image) {
			const publicId = product.image.split('/').pop().split('.')[0]; // Extract public ID from the image URL
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log('Image deleted from Cloudinary successfully');
			} catch (error) {
				console.error('Error deleting image from Cloudinary:', error);
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: 'Product deleted successfully' });
	} catch (error) {
		console.error('Error deleting product:', error);
		res.status(500).json({ message: 'Error deleting product', error: error.message });
	}
};

export const getRecommendedProducts = async (_, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 3 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.error('Error fetching recommended products:', error);
		res.status(500).json({ message: 'Error fetching recommended products', error: error.message });
	}
};

export const getProductByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.status(200).json(products);
	} catch (error) {
		console.error('Error fetching products by category:', error);
		res.status(500).json({ message: 'Error fetching products by category', error: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();

			await updateFeaturedProductsCache();

			res.status(200).json(updatedProduct);
		} else {
			res.status(404).json({ message: 'Product not found' });
		}
	} catch (error) {
		console.log('Error toggling featured product:', error);
		res.status(500).json({ message: 'Error toggling featured product', error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		// .lean() is used to return plain JavaScript objects instead of MongoDB documents
		// which is more efficient for read operations (performance optimization)
		const featuredProducts = await Product.find({ isFeatured: true }).lean();

		await redis.set('featured_products', JSON.stringify(featuredProducts)); // Cache for 1 hour
	} catch (error) {
		console.log('Error updating featured products cache:', error);
		res.status(500).json({ message: 'Error updating featured products cache', error: error.message });
	}
}
