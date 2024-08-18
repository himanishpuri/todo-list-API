import express from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
} from "../controllers/user.controller.js";
import {
	verifyRefreshToken,
	authenticateRegistrationDetails,
} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/register").post(authenticateRegistrationDetails, registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyRefreshToken, logoutUser);

export default router;
