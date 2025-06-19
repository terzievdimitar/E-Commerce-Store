import mongoose from 'mongoose';

export const connectDB = async () => {
	try {
		const connection = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected successfully to database: ${connection.connection.db.databaseName}`);
	} catch (error) {
		console.error(`Error connecting to MongoDB: ${error.message}`);
		process.exit(1); // Exit process with failure
	}
};
