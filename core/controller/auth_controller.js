const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/user");
const { generateJWT } = require("../helper/jwt_generator");
const userRepository = require("../repository/user_repository");
const { ca } = require("date-fns/locale");
const { verify } = require("jsonwebtoken");

const login = async (req = request, res = response) => {
	const { email, password } = req.body;

	try {
		const user = await userRepository.findUserByEmail(email);

		// Checks if the email exists.
		if (!user) {
			return res.status(400).json({
				msg: "Invalid email or password.",
			});
		}

		// Checks if the user is enabled.
		if (!user.isEnabled) {
			return res.status(400).json({
				msg: "Invalid email or password.",
			});
		}

		// Checks the password.
		const validPassword = bcrypt.compareSync(password, user.password);
		if (!validPassword) {
			return res.status(400).json({
				msg: "Invalid email or password.",
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

const register = async (req = request, res = response) => {
	// Gets the body of the request.
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

const forgotPassword = async (req = request, res = response) => {
	const { email } = req.body;

	try {
		const result = await userRepository.findUserByEmail(email);
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

const resetPassword = async (req = request, res = response) => {
	const { password, resetPasswordToken } = req.body;

	try {
		const result = await userRepository.findUserByResetPasswordToken(
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

const requestVerifyToken = async (req = request, res = response) => {
	const { email } = req.body;
	try {
		const result = await userRepository.findUserByEmail(email);
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

const verifyToken = async (req = request, res = response) => {
	const { verifyToken } = req.body;
	try {
		const result = await userRepository.findUserByVerifyToken(verifyToken);
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
