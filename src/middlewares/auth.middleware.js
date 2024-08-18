import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

export const verifyAccessToken = function (req, res, next) {
	// get access token
	// verify it and decode it
	// check if it hasn't expired yet.
	// save in req.user
	// next()

	const authHeader = req.headers["authorization"]?.split(" ")[1];
	const accessToken = req.cookies?.accessToken || authHeader;

	if (!accessToken) {
		return new ApiError(401, "Invalid or Absent Access Token.").JSONError(
			res,
		);
	}

	try {
		const decodedToken = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET,
		);

		req.user = decodedToken;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return new ApiError(401, "Expired Access Token.", error).JSONError(
				res,
			);
		}
		return new ApiError(401, "Invalid Token.", error).JSONError(res);
	}
};

export const verifyRefreshToken = function (req, res, next) {
	// get access token
	// verify it and decode it
	// check if it hasn't expired.
	// save in req.user
	// next()

	const refreshToken = req.cookies?.refreshToken;

	if (!refreshToken) {
		return new ApiError(401, "Invalid or Absent Refresh Token.").JSONError(
			res,
		);
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
		if (error.name === "TokenExpiredError") {
			return new ApiError(401, "Expired Refresh Token.", error).JSONError(
				res,
			);
		}
		return new ApiError(401, "Invalid Token.", error).JSONError(res);
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

export const preventRepeatedLogin = function (req, res, next) {
	const authHeader = req.headers["authorization"]?.split(" ")[1];
	const accessToken = req.cookies?.accessToken || authHeader;

	if (accessToken) {
		try {
			jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
			return new ApiError(400, "You are already logged in.").JSONError(res);
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				// Token is expired, allow user to log in again
				return next();
			}
			// For other errors, treat it as invalid token and allow login
			return next();
		}
	}

	// No token present, allow login
	next();
};
