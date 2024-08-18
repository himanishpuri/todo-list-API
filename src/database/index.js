import mongoose from "mongoose";

const connectDB = async function () {
	try {
		const dpResponse = await mongoose.connect(process.env.MONGODB_URI, {
			dbName: "todoListDb",
		});
		console.log("Connected to Database:", dpResponse.connection.name);
	} catch (error) {
		console.log("Error Connecting to Database:", error);
	}
};

export default connectDB;
