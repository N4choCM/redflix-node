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
		const query = "SELECT * FROM users WHERE id = $1";
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
		const query = "SELECT * FROM users WHERE email = $1";
		const user = await pool.query(query, [email]);
		return user;
};

// Finds a user by its resetPasswordToken
const findUserByResetPasswordToken = async (resetPasswordToken) => {
  const query = "SELECT * FROM users WHERE reset_password_token = $1";
  const user = await pool.query(query, [resetPasswordToken]);
  return user;
};

// Finds a user by its verifyToken
const findUserByVerifyToken = async (verifyToken) => {
  const query = "SELECT * FROM users WHERE verify_token = $1";
  const user = await pool.query(query, [verifyToken]);
  return user;
};

const save = async (user) => {
  console.log("[user_repository] user: ", user);
  const query = "INSERT INTO redflix_node_develop.users (username, email, password, first_name, last_name, role, created_at, reset_password_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
  try{
    await pool.query(query, [user.username, user.email, user.password, user.firstName, user.lastName, user.role, user.createdAt, user.resetPasswordToken? user.resetPasswordToken : null]);
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
  findUserByVerifyToken
};
