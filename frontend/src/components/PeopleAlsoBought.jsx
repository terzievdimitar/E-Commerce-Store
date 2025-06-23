import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

const PeopleAlsoBought = () => {
	const [recommendations, setRecommendations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				const response = await axios.get('/products/recommendations');
				setRecommendations(response.data.products);
			} catch (error) {
				toast.error('Failed to show recommendations');
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecommendations();
	}, []);

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className='mt-8'>
			<h3 className='text-2xl font-semibold text-orange-400'>People also bought</h3>
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
				{recommendations.map((product) => (
					<ProductCard
						key={product._id}
						product={product}
					/>
				))}
			</div>
		</div>
	);
};

export default PeopleAlsoBought;
