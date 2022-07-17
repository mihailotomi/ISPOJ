//dependencies
const bcrypt = require("bcryptjs");

//modules
const { client } = require("../db/config");
const Role = require("./Role");
const { CADET, COMMANDER } = require("../db/constants");

//@ MODEL
module.exports = class User {
  constructor(id, firstName, lastName, username, password, phone, adress, role) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = password;
    this.phone = phone;
    this.adress = adress;
    this.role = role;
  }

  getId = () => {
    return this.id;
  };

  getAdress = () => {
    return this.adress;
  };

  getPhone = () => {
    return this.phone;
  };

  getFullName = () => {
    return `${this.firstName} ${this.lastName}`;
  };

  getRoleName = () => {
    return this.role.getName();
  };

  toSession = () => {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      role: this.getRoleName(),
    };
  };

  isCadet = () => {
    return this.role.getName() === CADET;
  };

  isCommander = () => {
    return this.role.getName() === COMMANDER;
  };

  static fromRaw = async (rawUser) => {
    const role = await Role.getById(rawUser.roleid);

    return new User(
      rawUser.id,
      rawUser.firstname,
      rawUser.lastname,
      rawUser.username,
      rawUser.password,
      rawUser.phone,
      rawUser.adress,
      role
    );
  };

  static addUser = async (credentials) => {
    try {
      const { firstName, lastName, username, password, adress, phone, roleId } = credentials;

      if (
        firstName == null ||
        lastName == null ||
        username == null ||
        password == null ||
        adress == null ||
        phone == null ||
        roleId == null
      ) {
        throw new Error("Sva polja moraju bit validna");
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const data = await client.query(
        "INSERT INTO users (firstname, lastname, username, password, adress, phone, roleid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [firstName, lastName, username, hashedPassword, adress, phone, roleId]
      );

      if (data.rows.length === 0) {
        throw new Error("Nepravilan unos");
      }

      const rawUser = data.rows[0];

      return await User.fromRaw(rawUser);
    } catch (error) {
      throw new Error(error.message || "greska pri kreiranju korisnika");
    }
  };

  static getByUsername = async (username) => {
    try {
      const data = await client.query(
        "SELECT id, firstName, lastName, username, phone, adress, password, roleid FROM users WHERE username = $1",
        [username]
      );

      if (data.rows.length === 0) {
        throw new Error("Nepostojeci korisnik");
      }

      const rawUser = data.rows[0];

      return await User.fromRaw(rawUser);
    } catch (error) {
      throw new Error(error.message || "Error fetching user");
    }
  };

  static getById = async (id) => {
    try {
      const data = await client.query(
        "SELECT id, firstName, lastName, username, password, roleid, adress, phone FROM users WHERE id = $1",
        [id]
      );

      if (data.rows.length === 0) {
        throw new Error("Nepostojeci korisnik");
      }

      const rawUser = data.rows[0];

      return await User.fromRaw(rawUser);
    } catch (error) {
      throw new Error(error.message || "Greska pri nalazenju korisnika");
    }
  };
};
