import axios from '../lib/axios';
import { useCartStore } from '../stores/useCartStore';
import { ArrowRight, CheckCircle, HandHeart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Confetti from 'react-confetti';

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(false);
	const { clearCart } = useCartStore();
	const [error, setError] = useState(null);

	useEffect(() => {
		const handleCheckoutSuccess = async (sessionId) => {
			try {
				await axios.post('/payments/checkout-success', { sessionId });
				clearCart(); // Clear the cart after successful purchase
			} catch (error) {
				console.error('Error handling checkout success:', error);
			} finally {
				setIsProcessing(false);
			}
		};

		const sessionId = new URLSearchParams(window.location.search).get('session_id');

		if (sessionId) {
			handleCheckoutSuccess(sessionId);
		} else {
			setIsProcessing(true);
			setError('No session ID found in the URL. Please try again.');
		}
	}, [clearCart]);

	if (isProcessing) return <p className='flex justify-center items-center min-h-screen'>Processing your purchase...</p>;

	return (
		<div className='min-h-screen flex items-center justify-center px-4'>
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={700}
				recycle={false}
			/>
			<div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
				<div className='p-6 sm:p-8'>
					<div className='flex justify-center'>
						<CheckCircle className='text-orange-400 w-16 h-16 mb-4' />
					</div>
					<h1 className='text-2xl sm:text-3xl font-bold text-center text-orange-400 mb-2'>Purchase Successful!</h1>

					<p className='text-gray-300 text-center mb-2'>Thank you for your order. {"We're"} processing it now.</p>
					<p className='text-orange-400 text-center text-sm mb-6'>Check your email for order details and updates.</p>
					<div className='bg-gray-700 rounded-lg p-4 mb-6'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm text-gray-400'>Order number</span>
							<span className='text-sm font-semibold text-orange-400'>#12345</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-gray-400'>Estimated delivery</span>
							<span className='text-sm font-semibold text-orange-400'>3-5 business days</span>
						</div>
					</div>

					<div className='space-y-4'>
						<button
							className='w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4
             rounded-lg transition duration-300 flex items-center justify-center'>
							<HandHeart
								className='mr-2'
								size={18}
							/>
							Thanks for trusting us!
						</button>
						<Link
							to={'/'}
							className='w-full bg-gray-700 hover:bg-gray-600 text-orange-400 font-bold py-2 px-4 
            rounded-lg transition duration-300 flex items-center justify-center'>
							Continue Shopping
							<ArrowRight
								className='ml-2'
								size={18}
							/>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PurchaseSuccessPage;
