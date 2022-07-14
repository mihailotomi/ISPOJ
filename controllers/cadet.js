const User = require("../models/User");
const Role = require("../models/Role");
const Application = require("../models/Application");
const { CADET } = require("../db/constants");

exports.isCadetMiddleware = (req, res, next) => {
  if (req.session.user.role === CADET) {
    next();
  } else {
    res.redirect("/");
  }
};

exports.applyForWeekend = async (req, res, next) => {
  try {
    //TO DO - refaktorisi
    const hasApplied = await Application.hasApplied(req.session.user.id);
    const application = await Application.apply({ ...req.body, userId: req.session.user.id });
    res.redirect("/");
  } catch (error) {
    console.error(error.stack);
  }
};
