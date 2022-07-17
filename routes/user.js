//dependencies
const express = require("express");

//modules
const authCotroller = require("../controllers/auth");

const router = express.Router();

//@ ROUTES

// POST => registruj novog korisnika
router.post("/register", authCotroller.registerUser);

//POST => prijavi korisnika
router.post("/login", authCotroller.loginUser);

//GET => renderuj stranicu za prijavljivanje
router.get("/login", authCotroller.getLoginPage);

//POST => odjavi korisnika
router.post("/logout", authCotroller.logoutUser);

module.exports = { router };
