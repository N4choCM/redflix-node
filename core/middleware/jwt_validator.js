const { request, response } = require("express");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  // Checks if the token was sent.
  if (!token) {
    return res.status(401).json({
      msg: "There is no JWT in the request.",
    });
  }

  try {
    // JWT verification and id extraction.
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Data of the authenticated user extraction.
    const user = await User.findById(id);

    // Checks if the User exists.
    if (!user) {
      return res.status(401).json({
        msg: "Invalid JWT - User does not exist.",
      });
    }

    // Checks if the User is active.
    if (!user.isEnabled) {
      return res.status(401).json({
        msg: "Invalid JWT - User is not active.",
      });
    }

    req.user = user;

    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({
      msg: "Invalid JWT.",
    });
  }
};

module.exports = {
  validateJWT,
};