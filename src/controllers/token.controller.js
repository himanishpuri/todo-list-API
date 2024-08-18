import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const generateNewAccessToken = async function (req, res, next) {
	try {
		if (!req?.user?.id) {
			return new ApiError(404, "User ID is missing.").JSONError(res);
		}
		const user = await User.findById(req?.user?.id);
		if (!user) {
			return new ApiError(404, "User Invalid.").JSONError(res);
		}

		const options = {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24,
		};

		const newAccessToken = user.generateAccessToken();
		return res
			.status(200)
			.cookie("accessToken", newAccessToken, options)
			.json({
				success: true,
				message: "New Access Token Generated Successfully.",
				user,
			});
	} catch (error) {
		return new ApiError(500, "Server Issue", error).JSONError(res);
	}
};
