require("dotenv").config();

const express = require("express");
const session = require("express-session");

const { client, conObject } = require("./db/config");
const Role = require("./models/Role");
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

app.use("/applications", applicationsRouter);
app.use(userRouter);

app.use("/", async (req, res) => {
  try {
    await Role.getById(2);
    res.send("hello");
  } catch (error) {
    console.error(error);
  }
});

app.post("/register", async (req, res) => {
  const { firstname, lastname, username, password, adress, phone, roleId } = req.body;

  if (
    firstname == null ||
    lastname == null ||
    username == null ||
    password == null ||
    adress == null ||
    phone == null ||
    roleId == null
  ) {
    return res.sendStatus(403);
  }

  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const data = await client.query(
      "INSERT INTO users (first_name, last_name, username, password, adress, phone, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [firstname, lastname, username, hashedPassword, adress, phone, roleId]
    );

    if (data.rows.length === 0) {
      res.sendStatus(403);
    }
    const user = data.rows[0];

    req.session.user = {
      id: user.id,
      firstname: user.firstname,
      surname: user.surname,
      email: user.email,
    };

    res.status(200);
    return res.json({ user: req.session.user });
  } catch (e) {
    console.error(e);
    return res.sendStatus(403);
  }
});

// now listen on port 3000...
const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

module.exports = { client };
