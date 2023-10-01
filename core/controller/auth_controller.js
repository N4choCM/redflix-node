const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/user");
const { generateJWT } = require("../helper/jwt_generator");
const userRepository = require("../repository/user_repository");
const { ca } = require("date-fns/locale");

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

//TODO: User object useless and clean logs
const register = async (req = request, res = response) => {
	// Gets the body of the request.
	const dto = req.body;
  console.log("DTO: ", dto)
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
  console.log("user before encrypting password: ", user)
	// Encrypts the password.
	const salt = bcrypt.genSaltSync(10);
	user.password = bcrypt.hashSync(password, salt);
  console.log("user after encrypting password: ", user)

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
		const user = await userRepository.findUserByEmail(email);

		const resetPasswordToken =
			user.id +
			Math.floor(Math.random() * 10000000)
				.toString()
				.padStart(7, "0");
		user.resetPasswordToken = resetPasswordToken;
		userRepository.save(user);
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
		const user = await userRepository.findUserByResetPasswordToken(
			resetPasswordToken
		);

		if (!user) {
			return res.status(400).json({
				msg: "Invalid token.",
			});
		}
		password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		user.password = password;
		user.resetPasswordToken = null;
		userRepository.save(user);
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
		const user = await userRepository.findUserByEmail(email);
		const verifyToken =
			user.id +
			Math.floor(Math.random() * 10000000)
				.toString()
				.padStart(7, "0");
		user.verifyToken = verifyToken;
		userRepository.save(user);
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
		const user = await userRepository.findUserByVerifyToken(verifyToken);
		user.verifyToken = null;
		user.role = "CUSTOMER";
		userRepository.save(user);
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
