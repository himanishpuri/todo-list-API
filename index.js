import dotenv from "dotenv";
dotenv.config({
	path: "./.env",
});
import app from "./app.js";
import connectDB from "./src/database/index.js";

const PORT = process.env.PORT || 3000;

connectDB()
	.then(() => {
		app.on("error", (err) => {
			console.error("An error occurred:", err);
		});

		app.listen(PORT, () => {
			console.log("Server Listening at:", PORT);
		});
	})
	.catch((err) => {
		console.error("Failed to connect to the database:", err);
		process.exit(1);
	});
