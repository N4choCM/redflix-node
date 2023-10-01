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
    isRoleValid,
    isEmailUnique,
    isUserByIdUnique,
  } = require("../helper/db_auth_validator");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Invalid email address.").isEmail(),
    check("password", "Password is required.").notEmpty(),
    validateFields,
  ],
  login
);

router.post(
    "/register",
    [
      check("firstName", "First name cannot be empty.").notEmpty(),
      check("lastName", "Last name cannot be empty.").notEmpty(),
      check("username", "Username cannot be empty.").notEmpty(),
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

  router.post(
    "/forgot-password",
    [
      check("email", "Invalid email.").isEmail(),
    ],
    forgotPassword
  );

  router.post(
    "/reset-password",
    [
      check("password", "Password must be alphanumeric and at least 8 characters long.").isLength({ min: 8 }).isAlphanumeric(),
      check("resetPasswordToken", "Invalid token.").isLength({ min: 8 })
    ],
    resetPassword
  );
  
  router.post(
    "/request-verify-token",
    [
      check("email", "Invalid email.").isEmail(),
    ],
    requestVerifyToken
  );

  router.post(
    "/verify-token",
    [
      check("verifyToken", "Invalid token.").isLength({ min: 8 })
    ],
    verifyToken
  );

module.exports = router;