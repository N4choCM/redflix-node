/**
 * @description Generates a JWT token.
 */
const jwt = require("jsonwebtoken");

/**
 * Generates a JWT.
 * @param {*} id The user id.
 * @returns The JWT if everything went well, an error otherwise.
 */
const generateJWT = (id) => {
  return new Promise((resolve, reject) => {
    const PAYLOAD = {id};
    jwt.sign(
      PAYLOAD,
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
      (e, token) => {
        if (e) {
          console.log(e);
          reject("JWT could not be generated.");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJWT,
};