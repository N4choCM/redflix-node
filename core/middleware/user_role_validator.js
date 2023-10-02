/**
 * @fileoverview Middleware to validate the role of the user.
 */
const { request, response } = require("express");
const { UnauthorizedException } = require("../exception/app_exception");

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
    throw new UnauthorizedException("To validate the role, it is required to validate the JWT before.");
  }
  const { role } = req.user;
  if (role !== "ADMIN") {
    throw new UnauthorizedException(`Requested resource is not available for ${role} users.`);
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
    throw new UnauthorizedException("To validate the role, it is required to validate the JWT before.");
  }
  const { role } = req.user;
  if (role !== "MANAGER") {
    throw new UnauthorizedException(`Requested resource is not available for ${role} users.`);
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
const isUserAllowed = (req = request, res = response, next) => {
  // Checks if the JWT was not validated before.
  if (!req.user) {
    throw new UnauthorizedException("To validate the role, it is required to validate the JWT before.");
  }
  const { role, username } = req.user;
  if (role !== "MANAGER" && role !== "ADMIN") {
    throw new UnauthorizedException(`Requested resource is not available for ${role} users.`);
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
const isUserMeAllowed = (req = request, res = response, next) => {
  // Checks if the JWT was not validated before.
  if (!req.user) {
    throw new UnauthorizedException("To validate the role, it is required to validate the JWT before.");
  }
  const { role } = req.user;
  if (role !== "MANAGER" && role !== "ADMIN" && role !== "EMPLOYEE" && role !== "CUSTOMER") {
    throw new UnauthorizedException(`Requested resource is not available for ${role} users.`);
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
    throw new UnauthorizedException("To validate the role, it is required to validate the JWT before.");
  }
  const { role } = req.user;
  if (role !== "EMPLOYEE") {
    throw new UnauthorizedException(`Requested resource is not available for ${role} users.`);
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
    throw new UnauthorizedException("To validate the role, it is required to validate the JWT before.");
  }
  const { role } = req.user;
  if (role !== "CUSTOMER") {
    throw new UnauthorizedException(`Requested resource is not available for ${role} users.`);
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
    throw new UnauthorizedException("To validate the role, it is required to validate the JWT before.");
  }
  const { role } = req.user;
  if (role !== "GUEST") {
    throw new UnauthorizedException(`Requested resource is not available for ${role} users.`);
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
    throw new UnauthorizedException("To validate the role, it is required to validate the JWT before.");
  }
  const { role } = req.user;
  if (role !== "DELETED_USER") {
    throw new UnauthorizedException(`Requested resource is not available for ${role} users.`);
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
  isUserAllowed,
  isUserMeAllowed
};