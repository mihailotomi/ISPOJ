//modules
const { COMMANDER, PENDING, APPROVED } = require("../db/constants");
const Application = require("../models/Application");

//@ CONTROLS
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

exports.getPendingList = async (req, res, next) => {
  try {
    const applications = await Application.getAllPending();
    res.render("pendingList", { type: PENDING, applications });
  } catch (error) {
    console.error(error);
  }
};

exports.getApprovedList = async (req, res, next) => {
  try {
    const applications = await Application.getAllApproved();
    res.render("approvedList", { applications, type: APPROVED });
  } catch (error) {
    console.error(error);
  }
};

exports.approve = async (req, res, next) => {
  try {
    if (this.isCommander(req.session.user)) {
      const id = req.params.id;
      let application = await Application.getById(id);
      await application.approve();
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
  }
};

exports.decline = async (req, res, next) => {
  try {
    if (this.isCommander(req.session.user)) {
      const id = req.params.id;
      let application = await Application.getById(id);
      await application.decline();
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
  }
};
