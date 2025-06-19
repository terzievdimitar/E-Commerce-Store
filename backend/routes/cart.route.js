import express from 'express';
import { addToCart, removeAllFromCart, updateQuantity, getCartItems } from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getCartItems);
router.post('/', protectRoute, addToCart);
router.delete('/', protectRoute, removeAllFromCart);
router.put('/:id', protectRoute, updateQuantity);

export default router;
