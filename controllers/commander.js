//modules
const User = require("../models/User");
const Role = require("../models/Role");
const COMMANDER = require("../db/constants");

exports.isCommander = (user) => {
  return user.role === COMMANDER;
};

exports.isCommanderMiddleware = (req, res, next) => {
  if (req.session.user.role === COMMANDER) {
    next();
  } else {
    res.redirect("/");
  }
};
