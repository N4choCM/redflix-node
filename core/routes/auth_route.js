/**
 * @fileoverview This file defines the routes for the authentication module.
 */
const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middleware/field_validator");
const { 
    login, 
    register, 
    forgotPassword, 
    resetPassword, 
    requestVerifyToken,
    verifyToken 
} = require("../controller/auth_controller");
const {
    isUsernameUnique,
    isEmailUnique,
  } = require("../helper/db_auth_validator");

/**
 * @description The router for the authentication module.
 */
const router = Router();

/**
 * @description The login route and its DTO validations.
 */
router.post(
  "/login",
  [
    check("username", "Username cannot be empty.").notEmpty(),
    check("password", "Password is required.").notEmpty(),
    validateFields,
  ],
  login
);

/**
 * @description The register route and its DTO validations.
 */
router.post(
    "/register",
    [
      check("firstName", "First name cannot be empty.").notEmpty(),
      check("lastName", "Last name cannot be empty.").notEmpty(),
      check("username", "Username cannot be empty.").notEmpty(),
      check("username").custom(isUsernameUnique),
      check(
        "password",
        "Password must be alphanumeric and at least 8 characters long."
      ).isLength({ min: 8 }).isAlphanumeric(),
      check("email", "Invalid email.").isEmail(),
      check("email").custom(isEmailUnique),
      validateFields,
    ],
    register
  );

  /**
   * @description The forgot password route and its DTO validations.
   */
  router.post(
    "/forgot-password",
    [
      check("email", "Invalid email.").isEmail(),
    ],
    forgotPassword
  );

  /**
   * @description The reset password route and its DTO validations.
   */
  router.post(
    "/reset-password",
    [
      check("password", "Password must be alphanumeric and at least 8 characters long.").isLength({ min: 8 }).isAlphanumeric(),
      check("resetPasswordToken", "Invalid token.").isLength({ min: 8 })
    ],
    resetPassword
  );
  
  /**
   * @description The request verify token route and its DTO validations.
   */
  router.post(
    "/request-verify-token",
    [
      check("email", "Invalid email.").isEmail(),
    ],
    requestVerifyToken
  );

  /**
   * @description The verify token route and its DTO validations.
   */
  router.post(
    "/verify-token",
    [
      check("verifyToken", "Invalid token.").isLength({ min: 8 })
    ],
    verifyToken
  );

module.exports = router;