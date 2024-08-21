import Todo from "../models/todo.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createTodo = asyncHandler(async function (req, res, next) {
	const { title, completed } = req.body;
	if (!title || title.trim().length === 0) {
		return new ApiError(404, "Todo Must Have a Title.").JSONError(res);
	}

	try {
		const userID = req?.user?.id;
		if (!userID) {
			return new ApiError(401, "Not Allowed. or Unauthorized.").JSONError(
				res,
			);
		}
		const todo = await Todo.create({
			title,
			completed,
			user: userID,
		});

		const user = await User.findByIdAndUpdate(
			userID,
			{ $push: { todos: todo._id } },
			{ new: true },
		);
		if (!user) {
			return new ApiError(
				401,
				"Not Allowed. or Unauthorized or User Not Found",
			).JSONError(res);
		}

		return res.status(201).json({
			id: todo._id,
			title,
		});
	} catch (error) {
		return new ApiError(401, "Unauthorized.").JSONError(res);
	}
});

export const updateTodo = asyncHandler(async function (req, res, next) {
	if (!req?.user) {
		return new ApiError(401, "User Not Valid").JSONError(res);
	}

	const { title, completed } = req.body;
	const { id } = req.params;

	if (!title || title.trim().length === 0 || !id) {
		return new ApiError(
			404,
			"Updated Todo Must Have a Title and an ID",
		).JSONError(res);
	}

	try {
		const todo = await Todo.findByIdAndUpdate(
			id,
			{
				$set: { title, completed },
			},
			{ new: true },
		);

		return res.status(200).json({
			id,
			title: todo.title,
			completed: todo.completed,
		});
	} catch (error) {
		return new ApiError(400, "Could Not Update.", error).JSONError(res);
	}
});

export const deleteTodo = asyncHandler(async function (req, res, next) {
	if (!req?.user) {
		return new ApiError(401, "User Not Valid").JSONError(res);
	}
	const { id } = req.params;
	if (!id) {
		return new ApiError(404, "No Todo ID detected To Delete.").JSONError(res);
	}

	try {
		const todo = await Todo.findByIdAndDelete(id);
		if (!todo) {
			return new ApiError(404, "Todo Not Found to Delete.").JSONError(res);
		}

		return res.status(204).json({
			message: "Todo Deleted Successfully.",
			success: true,
		});
	} catch (error) {
		return new ApiError(400, "Could Not Delete!", error).JSONError(res);
	}
});

export const getTodos = asyncHandler(async function (req, res, next) {
	const page = parseInt(req.query?.page, 10);
	const limit = parseInt(req.query?.limit, 10) || 5; // default is 5

	if (!req?.user) {
		return new ApiError(401, "User Not Valid").JSONError(res);
	}
	if (!page) {
		return new ApiError(404, "No Page detected.").JSONError(res);
	}

	try {
		const todos = await Todo.find({ user: req.user?.id })
			.select("title completed _id")
			.skip((page - 1) * limit)
			.limit(limit)
			.lean(); // returns a simple js object

		return res.status(200).json({
			data: todos,
			page,
			limit,
			total: todos.length,
			success: true,
		});
	} catch (error) {
		return new ApiError(400, "Could not get Todos.", error).JSONError(res);
	}
});

// const generateNewAccessToken = async function (req, res, next) {
// 	try {
// 		if (!req?.user?.id) {
// 			return new ApiError(404, "User ID is missing.").JSONError(res);
// 		}
// 		const user = await User.findById(req?.user?.id);
// 		if (!user) {
// 			return new ApiError(404, "User Invalid.").JSONError(res);
// 		}

// 		const options = {
// 			httpOnly: true,
// 			maxAge: 1000 * 60 * 60 * 24,
// 		};

// 		const newAccessToken = user.generateAccessToken();
// 		return res
// 			.status(200)
// 			.cookie("accessToken", newAccessToken, options)
// 			.json({
// 				success: true,
// 				message: "New Access Token Generated Successfully.",
// 				user,
// 			});
// 	} catch (error) {
// 		return new ApiError(500, "Server Issue", error).JSONError(res);
// 	}
// };
