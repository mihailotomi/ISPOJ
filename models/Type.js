//modules
const { client } = require("../db/config");

//@ MODEL
module.exports = class Type {
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
      const data = await client.query("SELECT * FROM types WHERE id = $1", [id]);

      if (data.rows.length === 0) {
        throw new Error("Nepostojeci tip odsustva");
      }

      const type = data.rows[0];

      return new Type(type.id, type.typename);
    } catch (error) {
      throw new Error(error.message || "Greska pri nalazenju tipa odsustva");
    }
  };

  static getByName = async (name) => {
    try {
      const data = await client.query("SELECT * FROM types WHERE typename = $1", [name]);

      if (data.rows.length === 0) {
        throw new Error("Nepostojeci tip odsustva");
      }

      const type = data.rows[0];

      return new Type(type.id, type.typename);
    } catch (error) {
      throw new Error(error.message || "Greska pri nalazenju tipa odsustva");
    }
  };

  static getAll = async () => {
    try {
      const data = await client.query("SELECT * FROM types", []);

      if (data.rows.length === 0) {
        throw new Error("Nepostojeci tip odsustva");
      }

      const types = data.rows;

      return types.map((type) => new Type(type.id, type.typename));
    } catch (error) {
      throw new Error(error.message || "Greska pri nalazenju tipa odsustva");
    }
  };
};
