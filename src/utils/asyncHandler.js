import ApiError from "./ApiError.js";

function asyncHandler(func) {
	return async function (req, res, next) {
		try {
			return await func(req, res, next);
		} catch (error) {
			return new ApiError(error.code || 500, error.message).JSONError(res);
		}
	};
}

export default asyncHandler;
