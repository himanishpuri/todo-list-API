import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const generateNewAccessToken = async function (req, res, next) {
	try {
		const user = await User.findById(req?.user?.id);
		if (!user) {
			return new ApiError(404, "User Invalid.");
		}

		const newAccessToken = user.generateAccessToken();

		return res.status(200).json({});
	} catch (error) {}
};
