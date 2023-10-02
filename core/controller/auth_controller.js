/**
 * @fileoverview Controller to manage the business logic of the Auth module endpoints.
 */
const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helper/jwt_generator");
const userRepository = require("../repository/user_repository");
const { BadRequestException, NotFoundException } = require("../exception/app_exception");

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
		// Checks if the user exists.
		if (!user) {
			throw new BadRequestException("Invalid username or password.");
		}
		// Checks if the user is enabled.
		if (!user.isEnabled) {
			throw new BadRequestException("Invalid username or password.");
		}
		// Checks the password.
		const validPassword = bcrypt.compareSync(password, user.password);
		if (!validPassword) {
			throw new BadRequestException("Invalid username or password.");
		}
		// Generates the token.
		const bearerToken = await generateJWT(user.id);
		res.json({
			msg: "Login succeeded",
			user,
			bearerToken,
		});
	} catch (e) {
		throw new Error(e.message)
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
	try{
		const dao = await userRepository.save(user);
		res.json({
			msg: "User registered successfully.",
			dao
		});
	} catch (e) {
		throw new Error(e.message)
	}
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
		if(!user){
			throw new NotFoundException(`No user found with email ${email}.`);
		}
		user.firstName = user.first_name;
		user.lastName = user.last_name;
		user.createdAt = user.created_at;
		const resetPasswordToken =
			user.id +
			Math.floor(Math.random() * 10000000)
				.toString()
				.padStart(7, "0");
		user.resetPasswordToken = resetPasswordToken;
		const dao = await userRepository.update(user);
		res.json({
			msg: "Forgot password triggered successfully.",
			dao,
		});
	} catch (e) {
		console.log(e);
		throw new Error(e.message)
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
			throw new NotFoundException(
				`No user found with resetPasswordToken ${resetPasswordToken}.`
			);
		}
		user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		user.resetPasswordToken = null;
		const dao = await userRepository.update(user);
		res.json({
			msg: "Password changed successfully.",
			dao,
		});
	} catch (e) {
		throw new Error(e.message)
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
		if(!user){
			throw new NotFoundException(`No user found with email ${email}.`);
		}
		user.firstName = user.first_name;
		user.lastName = user.last_name;
		user.createdAt = user.created_at;
		const verifyToken =
			user.id +
			Math.floor(Math.random() * 10000000)
				.toString()
				.padStart(7, "0");
		user.verifyToken = verifyToken;
		try {
			const dao = await userRepository.update(user);
			res.json({
				msg: "Verify token generated successfully.",
				dao,
			});
		} catch (e) {
			throw new Error(e.message)
		}
	} catch (e) {
		throw new Error(e.message)
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
		if(!user){
			throw new NotFoundException(`No user found with verifyToken ${verifyToken}.`);
		}
		user.firstName = user.first_name;
		user.lastName = user.last_name;
		user.createdAt = user.created_at;
		user.verifyToken = null;
		user.role = "CUSTOMER";
		try{
			const dao = await userRepository.update(user);
			res.json({
				msg: "User verified successfully.",
				dao,
			});
		} catch (e) {
			throw new Error(e.message)
		}
	} catch (e) {
		throw new Error(e.message)
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
