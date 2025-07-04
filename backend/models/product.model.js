import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		image: {
			type: String,
			required: [true, 'Image URL is required'],
		},
		category: {
			type: String,
			required: [true, 'Category is required'],
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.model('Product', productSchema);

export default Product;
