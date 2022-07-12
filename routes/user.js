//dependencies
const express = require("express");

//modules
const authCotroller = require("../controllers/auth");

const router = express.Router();

//@ ROUTES
router.post("/register", authCotroller.registerUser);

router.post("/login", authCotroller.loginUser);

router.get("/login", authCotroller.getLoginPage);

module.exports = { router };
