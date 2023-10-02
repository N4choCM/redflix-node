/**
 * @fileoverview Middleware to validate the role of the user.
 */
const { request, response } = require("express");

/**
 * Checks if the user has access to the endpoint.
 * @param {*} req The request where the user info is stored.
 * @param {*} res The response.
 * @param {*} next The next function.
 * @returns 401 if the user is not allowed, the next function otherwise.
 */
const isUserAllowed = (req = request, res = response, next) => {
    // Checks if the JWT was not validated before.
    if (!req.user) {
      return res.status(500).json({
        msg: "To validate the role, it is required to validate the JWT before.",
      });
    }
    const { role, username } = req.user;
    if (role !== "MANAGER" && role !== "ADMIN" && role !== "EMPLOYEE" && role !== "CUSTOMER") {
      return res.status(401).json({
        msg: `${username} is not allowed.`,
      });
    }
    next();
  };

/**
 * Checks if the user has access to the endpoint.
 * @param {*} req The request where the user info is stored.
 * @param {*} res The response.
 * @param {*} next The next function.
 * @returns 401 if the user is not allowed, the next function otherwise.
 */
const isUserAllowedToSaveAndUpdate = (req = request, res = response, next) => {
    // Checks if the JWT was not validated before.
    if (!req.user) {
      return res.status(500).json({
        msg: "To validate the role, it is required to validate the JWT before.",
      });
    }
    const { role, username } = req.user;
    if (role !== "MANAGER" && role !== "ADMIN" && role !== "EMPLOYEE") {
      return res.status(401).json({
        msg: `${username} is not allowed.`,
      });
    }
    next();
  };  

/**
 * Checks if the user is ADMIN.
 * @param {*} req The request where the user info is stored.
 * @param {*} res The response.
 * @param {*} next The next function.
 * @returns 401 if the user is not ADMIN, the next function otherwise.
 */
const isUserAdmin = (req = request, res = response, next) => {
    // Checks if the JWT was not validated before.
    if (!req.user) {
      return res.status(500).json({
        msg: "To validate the role, it is required to validate the JWT before.",
      });
    }
    const { role, username } = req.user;
    if (role !== "ADMIN") {
      return res.status(401).json({
        msg: `${username} is not ADMIN.`,
      });
    }
    next();
  };  

module.exports = {
  isUserAllowed,
  isUserAllowedToSaveAndUpdate,
  isUserAdmin,
};