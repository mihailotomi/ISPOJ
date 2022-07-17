//dependencies
const express = require("express");

//modules
const router = express.Router();
const Type = require("../models/Type");
const authController = require("../controllers/auth");
const cadetController = require("../controllers/cadet");
const commanderController = require("../controllers/commander");

//@ ROUTES

//GET => renderuj stranicu za prijavu za vikend
router.get("/apply", authController.isAuth, cadetController.isCadetMiddleware, cadetController.getApplyPage);

//POST => prijavi za vikend
router.post("/apply", authController.isAuth, cadetController.isCadetMiddleware, cadetController.applyForWeekend);

//GET => uvid prijave
router.get("/insight/:id", authController.isAuth, authController.getInsightPage);

//GET => spisak prijava
router.get(
  "/pending",
  authController.isAuth,
  commanderController.isCommanderMiddleware,
  commanderController.getPendingList
);

//GET => spisak odobrenih
router.get(
  "/approved",
  authController.isAuth,
  commanderController.isCommanderMiddleware,
  commanderController.getApprovedList
);

//POST => odobri prijavu
router.post("/approve/:id", authController.isAuth, commanderController.approve);

//POST => odbij prijavu
router.post("/decline/:id", authController.isAuth, commanderController.decline);

module.exports = { router };
