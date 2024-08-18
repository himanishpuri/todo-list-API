export default class ApiError extends Error {
	constructor(status, message = "", error = null) {
		super(message);
		this.status = status;
		this.error = error;
	}

	JSONError(res) {
		return res.status(this.status).json({
			success: false,
			message: this.message,
			status: this.status,
			error: this.error,
		});
	}
}
