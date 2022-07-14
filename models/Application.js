//modules
const { client } = require("../db/config");
const User = require("./User");
const Type = require("./Type");
const Status = require("./Status");
const { PENDING } = require("../db/constants");

//@ MODEL
module.exports = class Application {
  constructor(id, user, type, status, dateFrom, dateTo) {
    this.id = id;
    this.user = user;
    this.type = type;
    this.status = status;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
  }

  getId() {
    return this.id;
  }

  static hasApplied = async (userId) => {
    try {
      const data = await client.query(
        "SELECT count(*) FROM applications WHERE userid = $1 AND (datefrom > now()::date)",
        [userId]
      );
      const count = data.rows[0].count;
      return count > 0;
    } catch (error) {
      throw new Error("Nepostojeca prijava");
    }
  };

  static apply = async ({ typeId, userId, dateFrom, dateTo }) => {
    try {
      const status = await Status.getByName(PENDING);
      const data = await client.query(
        "INSERT INTO applications(typeid,statusid,userid,datefrom,dateto) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [typeId, status.getId(), userId, dateFrom, dateTo]
      );

      if (data.rows.length === 0) {
        throw new Error("Greska pri kreiranju prijave");
      }

      const rawApplication = data.rows[0];

      return Application.fromRaw(rawApplication);
    } catch (error) {}
  };

  static fromRaw = async (rawApplication) => {
    const user = await User.getById(rawApplication.userid);
    const type = await Type.getById(rawApplication.typeid);
    const status = await Status.getById(rawApplication.statusid);

    return new Application(rawApplication.id, user, type, status, rawApplication.datefrom, rawApplication.dateto);
  };

  static getById = async (id) => {
    try {
      const data = await client.query("SELECT * FROM applications WHERE id = $1", [id]);

      if (data.rows.length === 0) {
        throw new Error("Nepostojeca prijava");
      }

      const rawApplication = data.rows[0];

      return await Application.fromRaw(rawApplication);
    } catch (error) {
      throw new Error(error.message || "Greska pri nalazenju prijave");
    }
  };

  static getByUserId = async (userId) => {
    try {
      const data = await client.query("SELECT * FROM applications WHERE userid = $1", [userId]);

      if (data.rows.length === 0) {
        throw new Error("Nepostojeca prijava");
      }

      const rawApplication = data.rows[0];

      return await Application.fromRaw(rawApplication);
    } catch (error) {
      throw new Error(error.message || "Greska pri nalazenju prijave");
    }
  };
};
