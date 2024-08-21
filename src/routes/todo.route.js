import express from "express";
import {
	verifyAccessToken,
	verifyRefreshToken,
} from "../middlewares/auth.middleware.js";
import {
	createTodo,
	updateTodo,
	deleteTodo,
} from "../controllers/todo.controller.js";
const router = express.Router();

router.route("/").post(verifyAccessToken, verifyRefreshToken, createTodo);
router
	.route("/:id")
	.put(verifyAccessToken, verifyRefreshToken, updateTodo)
	.delete(verifyAccessToken, verifyRefreshToken, deleteTodo);

export default router;
