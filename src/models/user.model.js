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
	},
	{ timestamps: true },
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 5);
	next();
});

userSchema.methods.generateAccessToken = async function () {
	return jwt.sign(
		{
			id: this._id,
			name: this.name,
			email: this.email,
			password: this.password,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "15m",
		},
	);
};

userSchema.methods.generateRefreshToken = async function () {
	return jwt.sign(
		{
			id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: "1h",
		},
	);
};

const User = mongoose.model("User", userSchema);
export default User;
