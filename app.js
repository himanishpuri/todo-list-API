import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();
const upload = multer();

app.use(express.json()); // to handle application/json
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: process.env.HOST_ORIGIN,
		credentials: true,
	}),
);
app.use(cookieParser());
app.use(upload.none()); // to handle multipart/formData

import userRouter from "./src/routes/user.route.js";
import todoRouter from "./src/routes/todo.route.js";
import { verifyRefreshToken } from "./src/middlewares/auth.middleware.js";
import { generateToken } from "./src/utils/token.util.js";

app.use("/api/user", userRouter);
app.use("/api/todos", todoRouter);
app.use("/api/newtoken", verifyRefreshToken, generateToken);

export default app;
