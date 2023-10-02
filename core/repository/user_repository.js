/**
 * @fileoverview User repository
 */
const { pool } = require("../../config/db_config");
const { NotFoundException } = require("../exception/app_exception");

/**
 * Checks if an email is unique.
 * @param {*} email The email to search.
 * @returns true if the email is unique, false otherwise.
 */
const isEmailUnique = async (email) => {
	try {
		const query = "SELECT * FROM redflix_node_develop.users WHERE email = $1";
		const result = await pool.query(query, [email]);

		if (!result.rows.length > 0) {
      return false;
    } else {
			return true;
		}
	} catch (error) {
		throw error;
	}
};

/**
 * Checks if an username is unique.
 * @param {*} username The username to search.
 * @returns true if the username is unique, false otherwise.
 */
const isUsernameUnique = async (username) => {
	try {
		const query = "SELECT * FROM redflix_node_develop.users WHERE username = $1";
		const result = await pool.query(query, [username]);

		if (!result.rows.length > 0) {
      return false;
    } else {
			return true;
		}
	} catch (error) {
		throw error;
	}
};

/**
 * Finds a user by its email.
 * @param {*} email The email of the user to be searched.
 * @returns The user if it exists, null otherwise.
 */
const findByEmail = async (email) => {
		const query = "SELECT * FROM redflix_node_develop.users WHERE email = $1";
		const dao = await pool.query(query, [email]);
		return dao;
};

/**
 * Finds a user by its username.
 * @param {*} username The username of the user to be searched.
 * @returns The user if it exists, null otherwise.
 */
const findByUsername = async (username) => {
  const query = "SELECT * FROM redflix_node_develop.users WHERE username = $1";
  const dao = await pool.query(query, [username]);
  return dao;
};

/**
 * Finds a user by its resetPasswordToken.
 * @param {*} resetPasswordToken The resetPasswordToken of the user to be searched.
 * @returns The user if it exists, null otherwise.
 */
const findByResetPasswordToken = async (resetPasswordToken) => {
  const query = "SELECT * FROM redflix_node_develop.users WHERE reset_password_token = $1";
  const dao = await pool.query(query, [resetPasswordToken]);
  return dao;
};

/**
 * Finds a user by its verifyToken.
 * @param {*} verifyToken The verifyToken of the user to be searched.
 * @returns The user if it exists, null otherwise.
 */
const findByVerifyToken = async (verifyToken) => {
  const query = "SELECT * FROM redflix_node_develop.users WHERE verify_token = $1";
  const dao = await pool.query(query, [verifyToken]);
  return dao;
};

/**
 * Saves a user in the DB.
 * @param {*} user The info of the user to be saved.
 */
const save = async (user) => {
  const query = "INSERT INTO redflix_node_develop.users (username, email, password, first_name, last_name, role, created_at, reset_password_token, verify_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
  try{
    await pool.query(query, [user.username, user.email, user.password, user.firstName, user.lastName, user.role, user.createdAt, user.resetPasswordToken? user.resetPasswordToken : null, user.verifyToken? user.verifyToken : null]);
    return user;
  } catch (error) {
    throw error;
  }
}

/**
 * Updates the info of a user in the DB.
 * @param {*} user The info of the user to be updated.
 */
const update = async (user) => {
  const query = "UPDATE redflix_node_develop.users SET username = $1, email = $2, password = $3, first_name = $4, last_name = $5, role = $6, created_at = $7, reset_password_token = $8, verify_token = $9 WHERE id = $10";
  try{
    await pool.query(query, [user.username, user.email, user.password, user.firstName, user.lastName, user.role, user.createdAt, user.resetPasswordToken? user.resetPasswordToken : null, user.verifyToken? user.verifyToken : null, user.id]);
    const dao = await findById(user.id);
    return dao.rows[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Finds a user by its id.
 * @param {*} id The id of the user to be searched.
 * @returns The user if it exists, null otherwise.
 */
const findById = async (id) => {
  const query = "SELECT * FROM redflix_node_develop.users WHERE id = $1";
  const dao = await pool.query(query, [id]);
  if(dao.rowCount === 0){
    throw new NotFoundException(`No user found with ID ${id}.`);
  }
  return dao;
};

/**
 * Finds all the users.
 * @returns All the users if they exist, null otherwise.
 */
const findAll = async () => {
  const query = "SELECT * FROM redflix_node_develop.users";
  const dao = await pool.query(query);
  return dao;
};

/**
 * Deletes a user by its id.
 * @param {*} id The id of the user to be deleted.
 */
const deleteById = async (id) => {
  const dao = await findById(id);
  if(!dao){
    throw new NotFoundException(`No user found with ID ${id}.`);
  }
  const query = "UPDATE redflix_node_develop.users SET is_enabled = false, role = 'DELETED_USER' WHERE id = $1";
  await pool.query(query, [id]);
  return dao.rows[0];
};

module.exports = {
	isEmailUnique,
  findByEmail,
  save,
  findByResetPasswordToken,
  findByVerifyToken,
  update,
  findById,
  findByUsername,
  isUsernameUnique,
  findAll,
  deleteById
};
