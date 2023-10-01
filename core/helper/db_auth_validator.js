const userRepository = require('../repository/user_repository');

const ROLES = ["ADMIN", "MANAGER", "EMPLOYEE", "CUSTOMER", "GUEST", "DELETED_USER"]

// Validates the given role.
const isRoleValid = async (role) => {
  const existingRole = ROLES.includes(role);

  if (!existingRole) {
    throw new Error(`${role} is an invalid role. Remember that the only available roles are ${ROLES}.`);
  }
};

// Validates the given Email.
const isEmailUnique = async (email) => {
  const existingEmail = await userRepository.isEmailUnique(email);
  if (existingEmail) {
    throw new Error(`${email} is already in use.`);
  }
};

// Validates the user.
const isUserByIdUnique = async (id) => {
  const existingUser = await userRepository.isUserByIdUnique(id);

  if (!existingUser) {
    throw new Error(`${id} does not match any registered user.`);
  }
};

module.exports = {
  isRoleValid,
  isEmailUnique,
  isUserByIdUnique,
};