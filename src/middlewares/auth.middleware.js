import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

export const verifyAccessToken = function (req, res, next) {
	// get access token
	// verify it and decode it
	// check if it hasn't expired yet.
	// save in req.user
	// next()
	req.user = null;
	const authHeader = req.headers["authorization"]?.split(" ")[1];
	const accessToken = req.cookies?.accessToken || authHeader;

	if (!accessToken) {
		return next();
	}

	try {
		const decodedToken = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET,
		);

		req.user = {
			id: decodedToken?.id,
		};
		next();
	} catch (error) {
		return next();
	}
};

export const verifyRefreshToken = function (req, res, next) {
	// get access token
	// verify it and decode it
	// check if it hasn't expired.
	// save in req.user
	// next()

	// if (req?.user) {
	// 	return next(); // this means access token was valid
	// }

	const refreshToken = req.cookies?.refreshToken;

	if (!refreshToken) {
		res.clearCookie("accessToken").clearCookie("refreshToken");
		return new ApiError(
			401,
			"Invalid or Absent Refresh Token or Already Logged Out.",
		).JSONError(res);
	}

	try {
		const decodedToken = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
		);

		req.user = {
			id: decodedToken?.id,
		};
		next();
	} catch (error) {
		res.clearCookie("accessToken").clearCookie("refreshToken");
		if (error.name === "TokenExpiredError") {
			new ApiError(
				401,
				"Expired Refresh Token.Logged out.",
				error,
			).JSONError(res);
		} else {
			new ApiError(
				401,
				"Invalid Token or Already Logged Out.",
				error,
			).JSONError(res);
		}
	}
};

// export const verifyLogoutToken = asyncHandler(async function (req, res, next) {
// 	const refreshToken = req.cookies?.refreshToken;
// 	if (!refreshToken) {
// 		return new ApiError(
// 			401,
// 			"User already logged out OR Unauthorized Logout.",
// 		).JSONError(res);
// 	}
// 	const token = accessToken || refreshToken;
// 	const SECRET =
// 		token === accessToken
// 			? process.env.ACCESS_TOKEN_SECRET
// 			: process.env.REFRESH_TOKEN_SECRET;

// 	try {
// 		const decodedToken = jwt.verify(token, SECRET);

// 		req.user = {
// 			id: decodedToken.id,
// 		};

// 		next();
// 	} catch (error) {
// 		return new ApiError(401, "Error", error).JSONError(res);
// 	}
// });

export const authenticateRegistrationDetails = async function (req, res, next) {
	const { email, name, password } = req.body;

	if (
		[name, email, password].some(
			(value) => !value || value.trim().length === 0,
		)
	) {
		return new ApiError(
			409,
			"Name, Email and Password are Required",
		).JSONError(res);
	}

	try {
		const user = await User.findOne({ email });
		if (user) {
			return new ApiError(409, "User Already Exists.").JSONError(res);
		}
	} catch (error) {
		return new ApiError(500, "Error trying to find User", error).JSONError(
			res,
		);
	}

	next();
};
