//dependencies
const bcrypt = require("bcryptjs");

//modules
const { client } = require("../db/config");
const User = require("../models/User");
const Role = require("../models/Role");

//& CONTROLS
exports.getLoginPage = (req, res) => {
  res.render("login");
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
    res.redirect("/");
  } catch (e) {
    console.error(e);
    return res.status(403).json({ message: e.message });
  }
};
