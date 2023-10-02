/**
 * @fileoverview Middleware to validate the request fields.
 */
const { validationResult } = require("express-validator");
const { BadRequestException } = require("../exception/app_exception");

/**
 * Validates that the fields of the requests are not empty.
 * @param {*} req The request.
 * @param {*} res The response.
 * @param {*} next The next function.
 * @returns A 400 response if the fields are empty, the next function otherwise.
 */
const validateFields = (req, res, next) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    throw new BadRequestException(e.array()[0].msg);
  }
  next();
};

module.exports = {
    validateFields,
};