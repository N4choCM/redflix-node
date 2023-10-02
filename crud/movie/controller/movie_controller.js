/**
 * @fileoverview Controller to manage the business logic of the User module endpoints.
 */
const { response, request } = require("express");
const movieRepository = require("../repository/movie_repository");
const { BadRequestException } = require("../../../core/exception/app_exception");

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
    try {
        const dao = await movieRepository.save(entity);
        res.json({
            msg: "Movie created successfully.",
            dao,
        });
    } catch (e) {
        throw new Error(e.message)
    }
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
        if (!dao) {
            throw new NotFoundException(`No movie found with ID ${id}.`);
        }
		res.json({
			msg: "Movie retrieved successfully.",
			dao,
		});
	} catch (e) {
		throw new Error(e.message)
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
        if (!dao) {
            throw new NotFoundException(`No movies found.`);
        }
		res.json({
			msg: "Movies retrieved successfully.",
			dao,
		});
	} catch (e) {
		throw new Error(e.message)
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
        if (!dto) {
            throw new NotFoundException(`No movie found with ID ${id}.`);
        }
        dto.title = title ? title : dto.title;
        dto.description = description ? description : dto.description;
        if(!type){
            dto.type = dto.type;
        }else if (!["ACTION", "SPORT", "ADVENTURE", "ROMANTIC", "COMEDY", "DOCUMENTARY", "HISTORIC", "CARTOON", "THRILLER"].includes(type)) {
            throw new BadRequestException(`Invalid type. Remember that the only available types are ACTION, SPORT, ADVENTURE, ROMANTIC, COMEDY, DOCUMENTARY, HISTORIC, CARTOON and THRILLER.`);
        } else {
            dto.type = type;
        }
		dto.trailerLink = trailerLink ? trailerLink : dto.trailer_link;
		const dao = await movieRepository.update(dto);
		res.json({
			msg: "Movie updated successfully.",
			dao,
		});
	} catch (e) {
		throw new Error(e.message)
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
		const dao = await movieRepository.deleteById(id);
		res.json({
			msg: `Movie with ID ${id} deleted successfully.`,
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
    create,
};
