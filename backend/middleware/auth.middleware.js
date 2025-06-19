import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;

		if (!accessToken) {
			return res.status(401).json({ message: 'Access token is missing' });
		}

		try {
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

			const user = await User.findById(decoded.userId).select('-password'); // Exclude password from user data

			if (!user) {
				return res.status(401).json({ message: 'User not found' });
			}

			req.user = user; // Attach user to request object

			next();
		} catch (error) {
			if (error.name === 'TokenExpiredError') {
				return res.status(401).json({ message: 'Access token has expired' });
			}
			throw error; // Re-throw other errors for handling in the catch block
		}
	} catch (error) {
		res.status(401).json({ message: 'Invalid access token', error: error.message });
	}
};

export const adminRoute = async (req, res, next) => {
	if (req.user && req.user.role === 'admin') {
		next(); // User is an admin, proceed to the next middleware or route handler
	} else {
		res.status(403).json({ message: 'Access denied. Admins only.' });
	}
};
