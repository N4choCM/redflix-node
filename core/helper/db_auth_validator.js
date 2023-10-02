/**
 * @fileOverview Database authentication validator.
 */
const { BadRequestException, ConflictException } = require('../exception/app_exception');
const userRepository = require('../repository/user_repository');

/**
 * @description The available roles.
 */
const ROLES = ["ADMIN", "MANAGER", "EMPLOYEE", "CUSTOMER", "GUEST", "DELETED_USER"]

/**
 * Checks if the given role is valid.
 * @param {*} role The given role.
 */
const isRoleValid = async (role) => {
  const existingRole = ROLES.includes(role);
  if (!existingRole) {
    throw new BadRequestException(`${role} is an invalid role. Remember that the only available roles are ${ROLES}.`);
  }
};

/**
 * Checks if the given email is unique.
 * @param {*} email The given email.
 */
const isEmailUnique = async (email) => {
  const existingEmail = await userRepository.isEmailUnique(email);
  if (existingEmail) {
    throw new ConflictException(`${email} is already in use.`);
  }
};

/**
 * Checks if the given username is unique.
 * @param {*} username The given username.
 */
const isUsernameUnique = async (username) => {
  const existingUsername = await userRepository.isUsernameUnique(username);
  if (existingUsername) {
    throw new ConflictException(`The username ${username} is already in use.`);
  }
};

module.exports = {
  isRoleValid,
  isEmailUnique,
  isUsernameUnique
};