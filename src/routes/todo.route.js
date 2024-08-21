import express from "express";
import {
	verifyAccessToken,
	verifyRefreshToken,
} from "../middlewares/auth.middleware.js";
import {
	createTodo,
	updateTodo,
	deleteTodo,
	getTodos,
} from "../controllers/todo.controller.js";
const router = express.Router();

router
	.route("/")
	.post(verifyAccessToken, verifyRefreshToken, createTodo)
	.get(verifyAccessToken, verifyRefreshToken, getTodos);
router
	.route("/:id")
	.put(verifyAccessToken, verifyRefreshToken, updateTodo)
	.delete(verifyAccessToken, verifyRefreshToken, deleteTodo);

export default router;
