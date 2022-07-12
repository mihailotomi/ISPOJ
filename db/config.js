const { Client } = require("pg");
const conObject = {
  user: "postgres",
  host: "localhost",
  database: "ispoj",
  password: "postgres",
  port: 5432,
};

const client = new Client(conObject);
client.connect();

module.exports = { client, conObject };
