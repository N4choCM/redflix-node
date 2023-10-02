/**
 * @fileoverview Middleware to validate the request fields.
 */
const { validationResult } = require("express-validator");

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
    return res.status(400).json(e);
  }
  next();
};

module.exports = {
    validateFields,
};