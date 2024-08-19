import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();
const upload = multer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: process.env.HOST_ORIGIN,
		credentials: true,
	}),
);
app.use(cookieParser());
app.use(upload.none());

import userRouter from "./src/routes/user.route.js";

app.use("/api/user", userRouter);

export default app;
