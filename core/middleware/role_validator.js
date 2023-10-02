/**
 * @fileoverview Middleware to validate the role of the user.
 */
const { request, response } = require("express");

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

/**
 * Checks if the user is MANAGER.
 * @param {*} req The request where the user info is stored.
 * @param {*} res The response.
 * @param {*} next The next function.
 * @returns 401 if the user is not MANAGER, the next function otherwise.
 */
const isUserManager = (req = request, res = response, next) => {
  // Checks if the JWT was not validated before.
  if (!req.user) {
    return res.status(500).json({
      msg: "To validate the role, it is required to validate the JWT before.",
    });
  }
  const { role, username } = req.user;
  if (role !== "MANAGER") {
    return res.status(401).json({
      msg: `${username} is not MANAGER.`,
    });
  }
  next();
};

/**
 * Checks if the user is EMPLOYEE.
 * @param {*} req The request where the user info is stored.
 * @param {*} res The response.
 * @param {*} next The next function.
 * @returns 401 if the user is not EMPLOYEE, the next function otherwise.
 */
const isUserEmployee = (req = request, res = response, next) => {
  // Checks if the JWT was not validated before.
  if (!req.user) {
    return res.status(500).json({
      msg: "To validate the role, it is required to validate the JWT before.",
    });
  }
  const { role, username } = req.user;
  if (role !== "EMPLOYEE") {
    return res.status(401).json({
      msg: `${username} is not EMPLOYEE.`,
    });
  }
  next();
};

/**
 * Checks if the user is CUSTOMER.
 * @param {*} req The request where the user info is stored.
 * @param {*} res The response.
 * @param {*} next The next function.
 * @returns 401 if the user is not CUSTOMER, the next function otherwise.
 */
const isUserCustomer = (req = request, res = response, next) => {
  // Checks if the JWT was not validated before.
  if (!req.user) {
    return res.status(500).json({
      msg: "To validate the role, it is required to validate the JWT before.",
    });
  }
  const { role, username } = req.user;
  if (role !== "CUSTOMER") {
    return res.status(401).json({
      msg: `${username} is not CUSTOMER.`,
    });
  }
  next();
};

/**
 * Checks if the user is GUEST.
 * @param {*} req The request where the user info is stored.
 * @param {*} res The response.
 * @param {*} next The next function.
 * @returns 401 if the user is not GUEST, the next function otherwise.
 */
const isUserGuest = (req = request, res = response, next) => {
  if (!req.user) {
    // Checks if the JWT was not validated before.
    return res.status(500).json({
      msg: "To validate the role, it is required to validate the JWT before.",
    });
  }
  const { role, username } = req.user;
  if (role !== "GUEST") {
    return res.status(401).json({
      msg: `${username} is not GUEST.`,
    });
  }
  next();
};

/**
 * Checks if the user is DELETED_USER.
 * @param {*} req The request where the user info is stored.
 * @param {*} res The response.
 * @param {*} next The next function.
 * @returns 401 if the user is not DELETED_USER, the next function otherwise.
 */
const isUserDeleted = (req = request, res = response, next) => {
  if (!req.user) {
    // Checks if the JWT was not validated before.
    return res.status(500).json({
      msg: "To validate the role, it is required to validate the JWT before.",
    });
  }
  const { role, username } = req.user;
  if (role !== "DELETED_USER") {
    return res.status(401).json({
      msg: `${username} is not DELETED_USER.`,
    });
  }
  next();
};


module.exports = {
  isUserAdmin,
  isUserManager,
  isUserEmployee,
  isUserCustomer,
  isUserGuest,
  isUserDeleted,
};