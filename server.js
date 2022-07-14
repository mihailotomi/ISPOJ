//dependencies
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

//modules
const { client, conObject } = require("./db/config");
const { router: userRouter } = require("./routes/user");
const { router: applicationsRouter } = require("./routes/application");
const authController = require("./controllers/auth");
const User = require("./models/User");
const Application = require("./models/Application");

// express app init and config
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session store and session config
const store = new (require("connect-pg-simple")(session))({
  conObject,
});

app.use(
  session({
    store: store,
    secret: "Some secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: false,
      sameSite: false,
      maxAge: 1000 * 60 * 60 * 0.5,
    },
  })
);

//view engine setup
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

//routes
app.use("/applications", applicationsRouter);
app.use(userRouter);

app.get("/", authController.isAuth, async (req, res) => {
  const user = await User.getById(req.session.user.id);
  if (user.isCadet()) {
    const hasApplied = await Application.hasApplied(user.getId());
    if (hasApplied) {
      const application = await Application.getByUserId(user.getId());
      res.redirect(`/applications/insight/${application.getId()}`);
    } else {
      res.redirect("applications/apply");
    }
  }
});

//listen
const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

module.exports = { client };
