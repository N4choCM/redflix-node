/**
 * @fileoverview Middleware to validate the JWT.
 */
const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const userRepository = require("../repository/user_repository");
const { UnauthorizedException, NotFoundException } = require("../exception/app_exception");

/**
 * Validates the JWT.
 * @param {*} req The request in which the JWT is sent.
 * @param {*} res The response.
 * @param {*} next The next function.
 * @returns 401 if there is a problem with the JWT, the next function otherwise.
 */
const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  // Checks if the token was sent.
  if (!token) {
    throw new UnauthorizedException("There is no JWT in the request.");
  }
  try {
    // JWT verification and id extraction.
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Data of the authenticated user extraction.
    const result = await userRepository.findById(id);
    const user = result.rows[0]
    user.isEnabled = user.is_enabled;
    // Checks if the User exists.
    if (!user) {
      throw new UnauthorizedException("Invalid JWT.");
    }
    // Checks if the User is active.
    if (!user.isEnabled) {
      throw new UnauthorizedException("Invalid JWT.");
    }
    req.user = user;
    next();
  } catch (e) {
    throw new UnauthorizedException(e.message);
  }
};

module.exports = {
  validateJWT,
};