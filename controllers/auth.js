//dependencies
const bcrypt = require("bcryptjs");

//modules
const User = require("../models/User");
const Role = require("../models/Role");
const cadetController = require("./cadet");

//& CONTROLS
exports.getLoginPage = (req, res) => {
  res.render("login");
};

//auth middleware
exports.isAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

exports.registerUser = async (req, res) => {
  try {
    const user = await User.addUser(req.body);

    req.session.user = user.toSession();

    res.status(200);
    return res.json(req.session.user);
  } catch (e) {
    console.error(e);
    return res.status(403).json({ message: e.message });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (username == null || password == null) {
    throw new Error("Korisnick ime i lozinka moraju bit validni");
  }

  try {
    const user = await User.getByUsername(username);

    const matches = bcrypt.compareSync(password, user.password);
    if (!matches) {
      throw new Error("Pogresna lozinka");
    }

    req.session.user = user.toSession();

    res.status(200);
    // res.json(req.session.user);
    if (cadetController.isCadet(req.session.user)) {
      res.redirect("/applications/apply");
    }
  } catch (e) {
    console.error(e);
    return res.status(403).json({ message: e.message });
  }
};
