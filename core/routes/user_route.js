/**
 * @fileoverview This file defines the routes for the user module.
 */
const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middleware/field_validator");
const { validateJWT } = require("../middleware/jwt_validator");
const {
	findById,
	findAll,
	findMe,
	updateById,
	updateMe,
	deleteById,
} = require("../controller/user_controller");
const {
	isUsernameUnique,
	isEmailUnique,
	isRoleValid,
} = require("../helper/db_auth_validator");
const {
	isUserAdmin,
	isUserManager,
	isUserEmployee,
	isUserCustomer,
  isUserAllowed,
  isUserMeAllowed,
} = require("../middleware/role_validator");

/**
 * @description The router for the user module.
 */
const router = Router();

/**
 * @description The findAll route and its DTO validations.
 * Consider only ADMIN and MANAGER have access to this endpoint.
 */
router.get("/", [validateJWT, isUserAllowed], findAll);

/**
 * @description The findMe route and its DTO validations.
 * Consider this endpoint can be accessed by every role except GUEST and DELETED_USER.
 */
router.get(
  "/me",
  [validateJWT, isUserMeAllowed],
  findMe
);

/**
 * @description The findById route and its DTO validations.
 * Consider only ADMIN and MANAGER have access to this endpoint.
 */
router.get("/:id", [validateJWT, isUserAllowed], findById);

/**
 * @description The updateMe route and its DTO validations.
 * Consider this endpoint can be accessed by every role except GUEST and DELETED_USER.
 */
router.put(
  "/me",
  [
    validateJWT,
    isUserMeAllowed,
    validateFields,
  ],
  updateMe
);

/**
 * @description The updateById route and its DTO validations.
 * Consider only ADMIN and MANAGER have access to this endpoint.
 */
router.put(
	"/:id",
	[
		validateJWT,
		isUserAllowed,
		check("role", "Please, insert a valid role.").custom(isRoleValid),
    check("isEnabled", "Please, insert true or false.").isBoolean(),
	],
	updateById
);


/**
 * @description The deleteById route and its DTO validations.
 * Consider only ADMIN users have access to this endpoint.
 */
router.delete("/:id", [validateJWT, isUserAdmin], deleteById);

module.exports = router;