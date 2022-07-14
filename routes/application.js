const express = require("express");

const router = express.Router();
const Type = require("../models/Type");
const authController = require("../controllers/auth");
const cadetController = require("../controllers/cadet");

router.get("/apply", authController.isAuth, cadetController.isCadetMiddleware, async (req, res) => {
  const types = await Type.getAll();
  res.render("apply", { user: req.session.user, message: "popuni prijavu", types });
});

router.post("/apply", authController.isAuth, cadetController.isCadetMiddleware, cadetController.applyForWeekend);

router.get("/insight/:id", authController.isAuth, authController.getInsightPage);

module.exports = { router };
