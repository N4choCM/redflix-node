/**
 * @fileoverview Controller to manage the business logic of the User module endpoints.
 */
const { response, request } = require("express");
const movieRepository = require("../repository/movie_repository");

/**
 * Creates a new movie.
 * @param {*} req The movie data from the body.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the movie was created successfully.
 */
const create = async (req = request, res = response) => {
	const dto = req.body;
	const { title, description, type, trailerLink } = dto;
	const entity = {
		title,
		description,
		type,
		trailerLink,
		createdAt: new Date(),
	};
	await movieRepository.save(entity);
	res.json({
		entity,
		msg: "Movie created successfully.",
	});
};

/**
 * Finds a movie by its id.
 * @param {*} req The id of the movie from the params.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the movie was retrieved successfully.
 */
const findById = async (req = request, res = response) => {
	const { id } = req.params;
	try {
		const result = await movieRepository.findById(id);
		const dao = result.rows[0];
		res.json({
			msg: "Movie retrieved successfully.",
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
 * Finds all the movies.
 * @param {*} req The request.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the movies were retrieved successfully.
 */
const findAll = async (req = request, res = response) => {
	try {
		const result = await movieRepository.findAll();
		const dao = result.rows;
		res.json({
			msg: "Movies retrieved successfully.",
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
 * Updates the information of a movie.
 * @param {*} req The id of the movie to be updated and the new info.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the movie was updated successfully.
 */
//TODO: Change List by Constant
const updateById = async (req = request, res = response) => {
	const { id } = req.params;
	const { title, description, type, trailerLink } = req.body;
	try {
		const result = await movieRepository.findById(id);
		const dto = result.rows[0];
        dto.title = title ? title : dto.title;
        dto.description = description ? description : dto.description;
        if (!["ACTION", "SPORT", "ADVENTURE", "ROMANTIC", "COMEDY", "DOCUMENTARY", "HISTORIC", "CARTOON", "THRILLER"].includes(type)) {
            dto.type = dto.type;
        } else {
            dto.type = type;
        }
		dto.trailerLink = trailerLink ? trailerLink : dto.trailer_link;
		await movieRepository.update(dto);
		res.json({
			msg: "Movie updated successfully.",
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
 * Deletes a movie by its id.
 * @param {*} req The id of the movie to be deleted.
 * @param {*} res Response after performing the request.
 * @returns 500 if there is an unexpected error, 200 if the movie was deleted successfully.
 */
const deleteById = async (req = request, res = response) => {
	const { id } = req.params;
	try {
		await movieRepository.deleteById(id);
		res.json({
			msg: `Movie with ID ${id} deleted successfully.`,
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
    create,
};
