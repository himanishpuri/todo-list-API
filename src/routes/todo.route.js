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

router.use(verifyAccessToken);

router.route("/").post(createTodo).get(getTodos);
router.route("/:id").put(updateTodo).delete(deleteTodo);

export default router;
