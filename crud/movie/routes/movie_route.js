/**
 * @fileoverview This file defines the routes for the movie module.
 */
const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../../../core/middleware/field_validator");
const { validateJWT } = require("../../../core/middleware/jwt_validator");
const {
	findById,
	findAll,
	updateById,
	deleteById,
	create,
} = require("../controller/movie_controller");
const {
	isUserAdmin,
	isUserAllowed,
	isUserAllowedToSaveAndUpdate,
} = require("../middleware/movie_role_validator");
const { isTypeValid } = require("../helper/db_movie_validator");

/**
 * @description The router for the movie module.
 */
const router = Router();

/**
 * @description The create route and its DTO validations.
 * Consider this endpoint can only be accessed by ADMIN, MANAGER and EMPLOYEE.
 */
//TODO: Add constrains for title to be unique.
router.post(
	"/",
	[
    validateJWT,
		check("title", "Title cannot be empty.").notEmpty(),
		check("description", "Description cannot be empty.").notEmpty(),
		check("type", "Type cannot be empty.").notEmpty(),
		check("type", "Please, insert a valid type.").custom(isTypeValid),
		check("trailerLink", "Trailer Link cannot be empty.").notEmpty(),
		validateFields,
		isUserAllowedToSaveAndUpdate,
	],
	create
);

/**
 * @description The findAll route and its DTO validations.
 * Consider this endpoint can be accessed by every role except GUEST and DELETED_USER.
 */
router.get("/", [validateJWT, isUserAllowed], findAll);

/**
 * @description The findById route and its DTO validations.
 * Consider this endpoint can be accessed by every role except GUEST and DELETED_USER.
 */
router.get("/:id", [validateJWT, isUserAllowed], findById);

/**
 * @description The updateById route and its DTO validations.
 * Consider only ADMIN, MANAGER and EMPLOYEE have access to this endpoint.
 */
router.put(
	"/:id",
	[
		validateJWT,
		isUserAllowedToSaveAndUpdate,
		validateFields,
	],
	updateById
);

/**
 * @description The deleteById route and its DTO validations.
 * Consider only ADMIN users have access to this endpoint.
 */
router.delete("/:id", [validateJWT, isUserAdmin], deleteById);

module.exports = router;
