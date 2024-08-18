import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";

export const verifyAccessToken = function (req, res, next) {
	// get access token
	// verify it and decode it
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
