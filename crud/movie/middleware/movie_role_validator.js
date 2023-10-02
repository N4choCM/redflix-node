/**
 * @fileoverview Middleware to validate the role of the user.
 */
const { request, response } = require("express");
const { UnauthorizedException } = require("../../../core/exception/app_exception");

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
    const { role } = req.user;
    if (role !== "MANAGER" && role !== "ADMIN" && role !== "EMPLOYEE" && role !== "CUSTOMER") {
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
const isUserAllowedToSaveAndUpdate = (req = request, res = response, next) => {
    // Checks if the JWT was not validated before.
    if (!req.user) {
      throw new UnauthorizedException("To validate the role, it is required to validate the JWT before.");
    }
    const { role } = req.user;
    if (role !== "MANAGER" && role !== "ADMIN" && role !== "EMPLOYEE") {
      throw new UnauthorizedException(`Requested resource is not available for ${role} users.`);
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
      throw new UnauthorizedException("To validate the role, it is required to validate the JWT before.");
    }
    const { role } = req.user;
    if (role !== "ADMIN") {
      throw new UnauthorizedException(`Requested resource is not available for ${role} users.`);
    }
    next();
  };  

module.exports = {
  isUserAllowed,
  isUserAllowedToSaveAndUpdate,
  isUserAdmin,
};