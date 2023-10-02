/**
 * @fileoverview Controller to manage the business logic of the User module endpoints.
 */
const { response, request } = require("express");
const userRepository = require("../repository/user_repository");

/**
 * Finds a user by its id.
 * @param {*} req The id of the user from the params.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the user was retrieved successfully.
 */
const findById = async (req = request, res = response) => {
	const { id } = req.params;
	try {
		const result = await userRepository.findById(id);
		const dao = result.rows[0];
		res.json({
			msg: "User retrieved successfully.",
			dao,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: "Oops, an unexpected error happened. If the problem persists, contact an administrator (nachocamposdev@gmail.com).",
		});
	}
};

/**
 * Finds all the users.
 * @param {*} req The request.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the users were retrieved successfully.
 */
const findAll = async (req = request, res = response) => {
	try {
		const result = await userRepository.findAll();
		const dao = result.rows;
		res.json({
			msg: "Users retrieved successfully.",
			dao,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: "Oops, an unexpected error happened. If the problem persists, contact an administrator (nachocamposdev@gmail.com).",
		});
	}
};

/**
 * Updates the information of a user.
 * @param {*} req The id of the user to be updated and the new info.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the user was updated successfully.
 */
const updateById = async (req = request, res = response) => {
	const { id } = req.params;
	const { isEnabled, role } = req.body;
	try {
		if (
			role !== "ADMIN" &&
			role != null &&
			role != undefined &&
			req.user.role === "MANAGER"
		) {
			throw new Error("ADMIN role cannot be modified.");
		}
		const result = await userRepository.findById(id);
		const dto = result.rows[0];
		dto.firstName = dto.first_name;
		dto.lastName = dto.last_name;
		dto.createdAt = dto.created_at;
		dto.isEnabled = isEnabled ? isEnabled : dto.is_enabled;
		dto.role = role ? role : dto.role;
		await userRepository.update(dto);
		res.json({
			msg: "User updated successfully.",
			dto,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: "Oops, an unexpected error happened. If the problem persists, contact an administrator (nachocamposdev@gmail.com).",
		});
	}
};

/**
 * Deletes a user by its id.
 * @param {*} req The id of the user to be deleted.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the user was deleted successfully.
 */
const deleteById = async (req = request, res = response) => {
	const { id } = req.params;
	try {
		await userRepository.deleteById(id);
		res.json({
			msg: `User with ID ${id} disabled successfully.`,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: "Oops, an unexpected error happened. If the problem persists, contact an administrator (nachocamposdev@gmail.com).",
		});
	}
};

/**
 * Finds the user info of the client being logged in.
 * @param {*} req The info of the user logged in.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the user was retrieved successfully.
 */
const findMe = async (req = request, res = response) => {
	const { user } = req;
	try {
		const result = await userRepository.findById(user.id);
		const dao = result.rows[0];
		res.json({
			msg: "User retrieved successfully.",
			dao,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: "Oops, an unexpected error happened. If the problem persists, contact an administrator (nachocamposdev@gmail.com).",
		});
	}
};

/**
 * Updates the information of the user who is logged in.
 * @param {*} req The id of the user to be updated and the new info.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the user was updated successfully.
 */
const updateMe = async (req = request, res = response) => {
	const { user } = req;
	const { username, email, firstName, lastName } = req.body;
	try {
		const toBeUpdated = await userRepository.findById(user.id);
		const dto = toBeUpdated.rows[0];
		dto.firstName = firstName ? firstName : dto.first_name;
		dto.lastName = lastName ? lastName : dto.last_name;
		dto.username =
			username && userRepository.isUsernameUnique(username)
				? username
				: dto.username;
		dto.email =
			email && userRepository.isEmailUnique(email)
				? email
				: dto.email;
		dto.createdAt = dto.created_at;
		dto.isEnabled = dto.is_enabled;
		await userRepository.update(dto);
		res.json({
			msg: "User updated successfully.",
			dto,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: "Oops, an unexpected error happened. If the problem persists, contact an administrator (nachocamposdev@gmail.com).",
		});
	}
};

module.exports = {
	findById,
	findAll,
	updateById,
	deleteById,
	findMe,
	updateMe,
};
