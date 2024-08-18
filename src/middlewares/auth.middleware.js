import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const verifyAccessToken = function (req, res, next) {
	// get access token
	// verify it and decode it
	// check if it hasn't expired yet.
	// save in req.user
	// next()

	const authHeader = req.headers?.authorization?.split(" ")[1];
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
		return new ApiError(401, "Invalid Token.", error).JSONError(res);
	}
};

export const verifyRefreshToken = function (req, res, next) {
	// get access token
	// verify it and decode it
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
			id: decodedToken?._id,
		};
		next();
	} catch (error) {
		return new ApiError(401, "Invalid Token.", error).JSONError(res);
	}
};
