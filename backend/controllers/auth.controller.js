import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { redis } from '../lib/redis.js';

const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15m',
	});
	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '7d',
	});

	return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // Store for 7 days
};

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie('accessToken', accessToken, {
		httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
		secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
		sameSite: 'Strict', // Helps prevent CSRF attacks
		maxAge: 15 * 60 * 1000, // 15 minutes
	});
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'Strict',
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};

export const signup = async (req, res) => {
	const { name, email, password } = req.body;
	const userExists = await User.findOne({ email });

	try {
		if (userExists) {
			return res.status(400).json({ message: 'User already exists' });
		}

		const newUser = await User.create({ name, email, password });

		// Authentication logic can be added here, e.g., generating a token
		const { accessToken, refreshToken } = generateTokens(newUser._id);
		await storeRefreshToken(newUser._id, refreshToken);

		setCookies(res, accessToken, refreshToken);

		res.status(201).json({
			message: 'User created successfully',
			user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
		});
	} catch (error) {
		let message = error.message;
		// If it's a Mongoose validation error, get the first error message
		if (error.name === 'ValidationError') {
			message = Object.values(error.errors)[0].message;
		}
		res.status(500).json({
			message,
			error: error.message,
		});
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateTokens(user._id);
			await storeRefreshToken(user._id, refreshToken);

			setCookies(res, accessToken, refreshToken);

			res.status(200).json({
				message: 'Login successful',
				user: { id: user._id, name: user.name, email: user.email, role: user.role },
			});
		} else {
			return res.status(401).json({ message: 'Invalid email or password' });
		}
	} catch (error) {
		let message = error.message;
		// If it's a Mongoose validation error, get the first error message
		if (error.name === 'ValidationError') {
			message = Object.values(error.errors)[0].message;
		}
		res.status(500).json({
			message,
			error: error.message,
		});
	}
};

export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del('refresh_token:' + decoded.userId); // Remove the refresh token from Redis
		}

		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');
		res.status(200).json({ message: 'Logged out successfully' });
	} catch (error) {
		let message = error.message;
		// If it's a Mongoose validation error, get the first error message
		if (error.name === 'ValidationError') {
			message = Object.values(error.errors)[0].message;
		}
		res.status(500).json({
			message,
			error: error.message,
		});
	}
};

export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: 'No refresh token provided' });
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) {
			return res.status(403).json({ message: 'Invalid refresh token' });
		}

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'Strict',
			maxAge: 15 * 60 * 1000, // 15 minutes
		});

		res.status(200).json({ message: 'Token refreshed successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error refreshing token', error: error.message });
	}
};

export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching profile', error: error.message });
	}
};
