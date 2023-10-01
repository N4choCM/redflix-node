const { request, response } = require("express");

const isUserAdmin = (req = request, res = response, next) => {
  if (!req.user) {
    // Checks if the JWT was not validated before.
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

const isUserManager = (req = request, res = response, next) => {
  if (!req.user) {
    // Checks if the JWT was not validated before.
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

const isUserEmployee = (req = request, res = response, next) => {
  if (!req.user) {
    // Checks if the JWT was not validated before.
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

const isUserCustomer = (req = request, res = response, next) => {
  if (!req.user) {
    // Checks if the JWT was not validated before.
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