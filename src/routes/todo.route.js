import express from "express";
import {
	verifyAccessToken,
	verifyRefreshToken,
} from "../middlewares/auth.middleware.js";
import { createTodo, updateTodo } from "../controllers/todo.controller.js";
const router = express.Router();

router.route("/").post(verifyAccessToken, verifyRefreshToken, createTodo);
router.route("/:id").put(updateTodo);

export default router;
