//dependencies
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

//modules
const { client, conObject } = require("./db/config");
const { router: userRouter } = require("./routes/user");
const { router: applicationsRouter } = require("./routes/application");

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

app.get("/", (req, res) => {
  if (req.session.user) {
    console.log(req.session.user);
    res.send(`Dobrodosao ${req.session.user.firstName} ${req.session.user.lastName}`);
  } else {
    res.redirect("/login");
  }
});

//listen
const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

module.exports = { client };
