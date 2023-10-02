/**
 * @fileoverview Controller to manage the business logic of the User module endpoints.
 */
const { response, request } = require("express");
const userRepository = require("../repository/user_repository");
const { NotFoundException, UnauthorizedException } = require("../exception/app_exception");

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
		throw new NotFoundException(`No user found with ID ${id}.\n[ERROR]: ${e.message}`);
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
		throw new NotFoundException(`No users found.\n[ERROR]: ${e.message}`);
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
			throw new UnauthorizedException("ADMIN role cannot be modified.");
		}
		const result = await userRepository.findById(id);
		const dto = result.rows[0];
		if(!dto){
			throw new NotFoundException(`No user found with ID ${id}.`);
		}
		dto.firstName = dto.first_name;
		dto.lastName = dto.last_name;
		dto.createdAt = dto.created_at;
		dto.isEnabled = isEnabled ? isEnabled : dto.is_enabled;
		dto.role = role ? role : dto.role;
		const dao = await userRepository.update(dto);
		res.json({
			msg: "User updated successfully.",
			dao,
		});
	} catch (e) {
		throw new Error(e.message)
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
		const dao = await userRepository.deleteById(id);
		if (dao.rowCount === 0) {
			throw new NotFoundException(`No user found with ID ${id}.`);
		}
		res.json({
			msg: `User with ID ${id} disabled successfully.`,
			dao
		});
	} catch (e) {
		throw new Error(e.message)
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
		if(!dao){
			throw new NotFoundException(`No user found with ID ${user.id}.`);
		}
		res.json({
			msg: "User retrieved successfully.",
			dao,
		});
	} catch (e) {
		throw new Error(e.message)
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
		if(!dto){
			throw new NotFoundException(`No user found with ID ${user.id}.`);
		}
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
		const dao = await userRepository.update(dto);
		res.json({
			msg: "User updated successfully.",
			dao,
		});
	} catch (e) {
		throw new Error(e.message)
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
