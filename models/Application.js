//modules
const { client } = require("../db/config");
const User = require("./User");
const Type = require("./Type");
const Status = require("./Status");
const { PENDING, APPROVED, DECLINED } = require("../db/constants");

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

  approve = async () => {
    const status = await Status.getByName(APPROVED);

    const data = await client.query("UPDATE applications SET statusid = $1 WHERE id = $2 RETURNING *", [
      status.getId(),
      this.getId(),
    ]);

    const rawApplication = data.rows[0];

    return await Application.fromRaw(rawApplication);
  };

  decline = async () => {
    const status = await Status.getByName(DECLINED);

    const data = await client.query("UPDATE applications SET statusid = $1 WHERE id = $2 RETURNING *", [
      status.getId(),
      this.getId(),
    ]);

    const rawApplication = data.rows[0];

    return await Application.fromRaw(rawApplication);
  };

  getId() {
    return this.id;
  }

  getType = () => {
    return this.type.getName();
  };

  getStatus() {
    return this.status.getName();
  }

  isPending() {
    return this.getStatus() === PENDING;
  }

  static hasApplied = async (userId) => {
    try {
      const data = await client.query(
        "SELECT count(*) as count FROM applications WHERE userid = $1 AND (datefrom >= now()::date)",
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

  static getAllApproved = async () => {
    try {
      const data = await client.query(
        "SELECT applications.id, userid, typeid, statusid, datefrom, dateto FROM applications INNER JOIN statuses ON applications.statusid = statuses.id WHERE statusname = $1",
        [APPROVED]
      );

      const applications = await Promise.all(data.rows.map(Application.fromRaw));

      return applications;
    } catch (error) {
      console.error(error);
    }
  };

  static getAllPending = async () => {
    try {
      const data = await client.query(
        "SELECT applications.id, userid, typeid, statusid, datefrom, dateto FROM applications INNER JOIN statuses ON applications.statusid = statuses.id WHERE statusname = $1",
        [PENDING]
      );

      const applications = await Promise.all(data.rows.map(Application.fromRaw));

      return applications;
    } catch (error) {
      console.error(error);
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
