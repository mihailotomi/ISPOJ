//modules
const Application = require("../models/Application");
const Type = require("../models/Type");
const { CADET } = require("../db/constants");

//@ CONTROLS
exports.isCadetMiddleware = (req, res, next) => {
  if (req.session.user.role === CADET) {
    next();
  } else {
    res.redirect("/");
  }
};

exports.getApplyPage = async (req, res) => {
  const types = await Type.getAll();
  res.render("apply", { user: req.session.user, message: "popuni prijavu", types });
};

exports.applyForWeekend = async (req, res, next) => {
  try {
    const application = await Application.apply({ ...req.body, userId: req.session.user.id });
    res.redirect("/");
  } catch (error) {
    console.error(error.stack);
  }
};
