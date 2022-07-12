//modules
const { client } = require("../db/config");

//@ MODEL
module.exports = class Status {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  static getById = async (id) => {
    try {
      const data = await client.query("SELECT * FROM statuses WHERE id = $1", [id]);

      if (data.rows.length === 0) {
        throw new Error("Nedefinisan status prijave");
      }

      const status = data.rows[0];

      return new Status(status.id, status.statusname);
    } catch (error) {
      throw new Error(error.message || "Greska pri nalazenju statusa prijave");
    }
  };

  static getByName = async (name) => {
    try {
      const data = await client.query("SELECT * FROM statuses WHERE statusname = $1", [name]);

      if (data.rows.length === 0) {
        throw new Error("Nedefinisan status prijave");
      }

      const status = data.rows[0];

      return new Status(status.id, status.statusname);
    } catch (error) {
      throw new Error(error.message || "Greska pri nalazenju statusa prijave");
    }
  };
};
