//modules
const { client } = require("../db/config");

//@ MODEL
module.exports = class Role {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  getName() {
    return this.name;
  }

  static getById = async (id) => {
    try {
      const data = await client.query("SELECT * FROM roles WHERE id = $1", [id]);
      const role = data.rows[0];

      return new Role(role.id, role.rolename);
    } catch (error) {
      throw new Error(error.message || "Greska pri nalazenju uloge");
    }
  };
};
