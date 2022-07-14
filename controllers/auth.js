//dependencies
const bcrypt = require("bcryptjs");

//modules
const User = require("../models/User");
const Application = require("../models/Application");
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
    if (user.isCadet()) {
      res.redirect("/applications/apply");
    }
  } catch (e) {
    console.error(e);
    return res.status(403).json({ message: e.message });
  }
};

exports.getInsightPage = async (req, res) => {
  try {
    const application = await Application.getById(req.params.id);
    const currentUser = await User.getById(req.session.user.id);
    //TO DO- dodaj status i formatiraj datume
    //samo ja i komandir možemo videti moju prijavu
    if (currentUser.isCommander() || currentUser.id === application.user.id) {
      res.render("applicationInsight", { isCommander: currentUser.isCommander(), application });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
