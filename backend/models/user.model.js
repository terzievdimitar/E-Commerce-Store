import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlenghth: [6, 'Password must be at least 6 characters long'],
		},
		cartItems: [
			{
				quantity: {
					type: Number,
					required: [true, 'Quantity is required'],
					default: 1,
				},
				prodcut: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
				},
			},
		],
		role: {
			type: String,
			enum: ['customer', 'admin'],
			default: 'customer',
		},
	},
	{
		timestamps: true,
	}
);

// Pre-save hook to hash the password before saving to the database
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.comparePassword = async function (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (error) {
		throw new Error('Error comparing password');
	}
};

const User = mongoose.model('User', userSchema);

export default User;
