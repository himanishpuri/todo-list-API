import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
		},
		password: {
			type: String,
			required: true,
			minLength: 1,
		},
		refreshToken: {
			type: String,
		},
		todos: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Todo",
			},
		],
	},
	{ timestamps: true },
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 5);
	next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			id: this._id,
			name: this.name,
			email: this.email,
			password: this.password,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		},
	);
};

userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		},
	);
};

const User = mongoose.model("User", userSchema);
export default User;
