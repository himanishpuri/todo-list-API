import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async function (req, res, next) {
	const { name, email, password } = req.body;
	if ([name, email, password].some((value) => value.trim().length === 0)) {
		return new ApiError(
			400,
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

	try {
		const user = await User.create({
			name,
			email,
			password,
		});

		const AccessToken = user.generateAccessToken();
		const RefreshToken = user.generateRefreshToken();
		user.refreshToken = RefreshToken;
		await user.save({ validateBeforeSave: false });

		const registeredUser = user.toObject();
		delete registeredUser._id;
		delete registeredUser.__v;
		delete registeredUser.password;
		delete registeredUser.createdAt;
		delete registeredUser.updatedAt;
		delete registeredUser.refreshToken;

		const options = {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24,
		};

		return res
			.status(201)
			.cookie("accessToken", AccessToken, options)
			.cookie("refreshToken", RefreshToken, options)
			.json({
				success: true,
				message: "User Created Successfully.",
				user: registeredUser,
			});
	} catch (error) {
		return new ApiError(500, "Server Issue", error).JSONError(res);
	}
});

export const loginUser = asyncHandler(async function (req, res, next) {
	// verify email and password
	// then we will send back new refresh and access token to the front

	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email }); // check if user exist.
		if (!user) {
			return new ApiError(401, "User Not Found.").JSONError(res);
		}

		const isRightPassword = await user.isPasswordCorrect(password); // check password
		if (!isRightPassword) {
			return new ApiError(401, "Wrong Password.").JSONError(res);
		}

		const newAccessToken = user.generateAccessToken();
		const newRefreshToken = user.generateRefreshToken();
		user.refreshToken = newRefreshToken;
		user.save({ validateBeforeSave: false });

		const loggedUser = await User.findById(user._id).select("email name");

		const options = {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24,
		};

		return res
			.status(200)
			.cookie("accessToken", newAccessToken, options)
			.cookie("refreshToken", newRefreshToken, options)
			.json({
				success: true,
				message: "User Logged In Successfully.",
				user: loggedUser,
			});
	} catch (error) {
		return new ApiError(500, "Server Issue", error).JSONError(res);
	}
});

export const logoutUser = asyncHandler(async function (req, res, next) {
	try {
		const user = await User.findByIdAndUpdate(req?.user?.id, {
			$set: { refreshToken: null },
		});

		if (!user) {
			return new ApiError(404, "User not found").JSONError(res);
		}

		return res
			.status(200)
			.clearCookie("accessToken")
			.clearCookie("refreshToken")
			.json({
				success: true,
				message: "User Logged Out Successfully!",
			});
	} catch (error) {
		return new ApiError(500, "Server Issue", error).JSONError(res);
	}
});
