//dependencies
const express = require("express");
const bcrypt = require("bcryptjs");

//modules
const { client } = require("../db/config");
const Role = require("../models/Role");
const User = require("../models/User");
const authCotroller = require("../controllers/auth");

const router = express.Router();

//ROUTES
router.post("/register", authCotroller.registerUser);

router.post("/login", authCotroller.loginUser);

router.get("/welcome", (req, res) => {
  res.send("welcome");
});

module.exports = { router };
