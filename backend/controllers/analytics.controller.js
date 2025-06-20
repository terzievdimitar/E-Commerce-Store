import User from '../models/user.model.js';
import Product from '../models/product.model.js';

export const getAnalytics = async (req, res) => {
	try {
		const analyticsData = await getAnalyticsData();

		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

		const dailySales = await getDailySalesData(startDate, endDate);

		res.status(200).json({ analyticsData, dailySales });
	} catch (error) {
		console.log('Error in getAnalytics controller:', error);
		res.status(500).json({ message: 'Error in getAnalytics controller', error: error.message });
	}
};

async function getAnalyticsData() {
	const totalUsers = await User.countDocuments();
	const totalProducts = await Product.countDocuments();

	const salesData = await Product.aggregate([
		{
			$group: {
				_id: null, // groups all documents together
				totalSales: { $sum: 1 }, // sums the sales field
				totalRevenue: { $sum: '$totalAmount' }, // sums the price field
			},
		},
	]);

	const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

	return {
		user: totalUsers,
		products: totalProducts,
		totalSales,
		totalRevenue,
	};
}

async function getDailySalesData(startDate, endDate) {
	try {
		const dailySalesData = await Product.aggregate([
			{
				$match: {
					createdAt: {
						$gte: startDate, // filter products created after startDate
						$lte: endDate, // filter products created before endDate
					},
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, // group by date
					sales: { $sum: 1 }, // count the number of products sold
					revenue: { $sum: '$totalAmount' }, // sum the price of products sold
				},
			},
			{
				$sort: { _id: 1 }, // sort by date ascending
			},
		]);

		const dateArray = getDatesInRange(startDate, endDate);

		return dateArray.map((date) => {
			const foundData = dailySalesData.find((data) => data._id === date);

			return {
				date,
				sales: foundData ? foundData.sales : 0, // if no data found for the date, set sales to 0
				revenue: foundData ? foundData.revenue : 0, // if no data found for the date, set revenue to 0
			};
		});
	} catch (error) {
		console.log('Error in getDailySalesData:', error);
		res.status(500).json({ message: 'Error in getDailySalesData', error: error.message });
	}
}

function getDatesInRange(startDate, endDate) {
	const dates = [];
	let currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().split('T')[0]); // format date as YYYY-MM-DD
		currentDate.setDate(currentDate.getDate() + 1); // increment by one day
	}

	return dates;
}
