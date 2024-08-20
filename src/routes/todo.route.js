import express from "express";
import {
	verifyAccessToken,
	verifyRefreshToken,
} from "../middlewares/auth.middleware.js";
import { createTodo } from "../controllers/todo.controller.js";
const router = express.Router();

router.route("/").post(verifyAccessToken, verifyRefreshToken, createTodo);

export default router;
