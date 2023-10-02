const { pool } = require("../../config/db_config");

// Check if an email is unique
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

// Checks if a user by ID already exists
const isUserByIdUnique = async (id) => {
	try {
		const query = "SELECT * FROM redflix_node_develop.users WHERE id = $1";
		const result = await pool.query(query, [id]);

		if (!result.rows.length > 0) {
      return false;
    } else {
			return true;
		}
	} catch (error) {
		throw error;
	}
};

// Finds a user by its email
const findUserByEmail = async (email) => {
		const query = "SELECT * FROM redflix_node_develop.users WHERE email = $1";
		const user = await pool.query(query, [email]);
		return user;
};

// Finds a user by its resetPasswordToken
const findUserByResetPasswordToken = async (resetPasswordToken) => {
  const query = "SELECT * FROM redflix_node_develop.users WHERE reset_password_token = $1";
  const user = await pool.query(query, [resetPasswordToken]);
  return user;
};

// Finds a user by its verifyToken
const findUserByVerifyToken = async (verifyToken) => {
  const query = "SELECT * FROM redflix_node_develop.users WHERE verify_token = $1";
  const user = await pool.query(query, [verifyToken]);
  return user;
};

const save = async (user) => {
  const query = "INSERT INTO redflix_node_develop.users (username, email, password, first_name, last_name, role, created_at, reset_password_token, verify_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
  try{
    await pool.query(query, [user.username, user.email, user.password, user.firstName, user.lastName, user.role, user.createdAt, user.resetPasswordToken? user.resetPasswordToken : null, user.verifyToken? user.verifyToken : null]);
  } catch (error) {
    throw error;
  }
}

const update = async (user) => {
  const query = "UPDATE redflix_node_develop.users SET username = $1, email = $2, password = $3, first_name = $4, last_name = $5, role = $6, created_at = $7, reset_password_token = $8, verify_token = $9 WHERE id = $10";
  try{
    await pool.query(query, [user.username, user.email, user.password, user.firstName, user.lastName, user.role, user.createdAt, user.resetPasswordToken? user.resetPasswordToken : null, user.verifyToken? user.verifyToken : null, user.id]);
  } catch (error) {
    throw error;
  }
}

module.exports = {
	isEmailUnique,
  isUserByIdUnique,
  findUserByEmail,
  save,
  findUserByResetPasswordToken,
  findUserByVerifyToken,
  update
};
