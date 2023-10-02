/**
 * @fileoverview Controller to manage the business logic of the Auth module endpoints.
 */
const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/user");
const { generateJWT } = require("../helper/jwt_generator");
const userRepository = require("../repository/user_repository");

/**
 * Logs in a user.
 * @param {*} req The email and password of the user from the body.
 * @param {*} res Response after performing the request.
 * @returns 400 if there is a problem with the payload, 500 if there is an unexpected error, 200 if the login was successful.
 */
const login = async (req = request, res = response) => {
	const { username, password } = req.body;
	try {
		const result = await userRepository.findByUsername(username);
		const user = result.rows[0];
		user.firstName = user.first_name;
		user.lastName = user.last_name;
		user.createdAt = user.created_at;
		user.isEnabled = user.is_enabled;
		// Checks if the username exists.
		if (!user) {
			return res.status(400).json({
				msg: "Invalid username or password a.",
			});
		}
		// Checks if the user is enabled.
		if (!user.isEnabled) {
			return res.status(400).json({
				msg: "Invalid username or password b.",
			});
		}
		// Checks the password.
		const validPassword = bcrypt.compareSync(password, user.password);
		console.log("password", password)
		console.log("user.password", user.password)
		if (!validPassword) {
			return res.status(400).json({
				msg: "Invalid username or password c.",
			});
		}
		// Generates the token.
		const bearerToken = await generateJWT(user.id);
		res.json({
			msg: "Login succeeded",
			user,
			bearerToken,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: "Oops, an unexpected error happened. If the problem persists, contact an administrator (nachocamposdev@gmail.com).",
		});
	}
};

/**
 * Registers a new user.
 * @param {*} req The user data from the body.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the user was registered successfully.
 */
const register = async (req = request, res = response) => {
	const dto = req.body;
	const { username, email, password, firstName, lastName } = dto;
	const user = {
		username,
		email,
		password,
		firstName,
		lastName,
		role: "GUEST",
		createdAt: new Date(),
	};
	// Encrypts the password.
	const salt = bcrypt.genSaltSync(10);
	user.password = bcrypt.hashSync(password, salt);
	// Stores the User in the DB.
	await userRepository.save(user);
	res.json({
		user,
		msg: "User registered successfully.",
	});
};

/**
 * Triggers the process to reset the password of a user.
 * @param {*} req The email of the user from the body.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the process was triggered successfully.
 */
const forgotPassword = async (req = request, res = response) => {
	const { email } = req.body;

	try {
		const result = await userRepository.findByEmail(email);
		const user = result.rows[0];
		user.firstName = user.first_name;
		user.lastName = user.last_name;
		user.createdAt = user.created_at;
		const resetPasswordToken =
			user.id +
			Math.floor(Math.random() * 10000000)
				.toString()
				.padStart(7, "0");
		user.resetPasswordToken = resetPasswordToken;
		userRepository.update(user);
		res.json({
			msg: "Forgot password triggered successfully.",
			user,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: "Oops, an unexpected error happened. If the problem persists, contact an administrator (nachocamposdev@gmail.com).",
		});
	}
};

/**
 * Completes the process to reset the password of a user.
 * @param {*} req The resetPasswordToken and the new password of the user from the body.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the process was completed successfully.
 */
const resetPassword = async (req = request, res = response) => {
	const { password, resetPasswordToken } = req.body;

	try {
		const result = await userRepository.findByResetPasswordToken(
			resetPasswordToken
		);

		const user = result.rows[0];
		user.firstName = user.first_name;
		user.lastName = user.last_name;
		user.createdAt = user.created_at;

		if (!user) {
			return res.status(400).json({
				msg: "Invalid token.",
			});
		}
		user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		user.resetPasswordToken = null;
		userRepository.update(user);
		res.json({
			msg: "Password changed successfully.",
			user,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: "Oops, an unexpected error happened. If the problem persists, contact an administrator (nachocamposdev@gmail.com).",
		});
	}
};

/**
 * Generates a verify token for the user.
 * @param {*} req The email of the user from the body.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the token was generated successfully.
 */
const requestVerifyToken = async (req = request, res = response) => {
	const { email } = req.body;
	try {
		const result = await userRepository.findByEmail(email);
		const user = result.rows[0];
		user.firstName = user.first_name;
		user.lastName = user.last_name;
		user.createdAt = user.created_at;
		const verifyToken =
			user.id +
			Math.floor(Math.random() * 10000000)
				.toString()
				.padStart(7, "0");
		user.verifyToken = verifyToken;
		userRepository.update(user);
		res.json({
			msg: "Verify token generated successfully.",
			user,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: "Oops, an unexpected error happened. If the problem persists, contact an administrator (nachocamposdev@gmail.com).",
		});
	}
};

/**
 * Validates the verify token of the user and sets his/her role to CUSTOMER.
 * @param {*} req The verify token of the user from the body.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the token was validated successfully.
 */
const verifyToken = async (req = request, res = response) => {
	const { verifyToken } = req.body;
	try {
		const result = await userRepository.findByVerifyToken(verifyToken);
		const user = result.rows[0];
		user.firstName = user.first_name;
		user.lastName = user.last_name;
		user.createdAt = user.created_at;
		user.verifyToken = null;
		user.role = "CUSTOMER";
		userRepository.update(user);
		res.json({
			msg: "User verified successfully.",
			user,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: "Oops, an unexpected error happened. If the problem persists, contact an administrator (nachocamposdev@gmail.com).",
		});
	}
};

module.exports = {
	login,
	register,
	forgotPassword,
	resetPassword,
	requestVerifyToken,
	verifyToken,
};
