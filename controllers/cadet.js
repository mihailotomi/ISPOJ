const CADET = "cadet";

const User = require("../models/User");
const Role = require("../models/Role");

exports.isCadet = (user) => {
  return user.role === CADET;
};

exports.isCadetMiddleware = (req, res, next) => {
  if (req.session.user.role === CADET) {
    next();
  } else {
    res.redirect("/");
  }
};
