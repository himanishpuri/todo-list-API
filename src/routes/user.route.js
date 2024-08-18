import express from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
} from "../controllers/user.controller.js";
import {
	verifyRefreshToken,
	preventRepeatedLogin,
} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(preventRepeatedLogin, loginUser);
router.route("/logout").post(verifyRefreshToken, logoutUser);

export default router;
