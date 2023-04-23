const { Sequelize } = require("sequelize");
var sequelize = require("sequelize");
var dbConfig = require("../config");

var s = dbConfig.setConnection();

exports.s = s;

exports.users = s.define(
  "users",
  {
    id: { type: "string", primaryKey: true, allowNull: false },
    email: "string",
    name: "string",
    username: "string",
    unicoins: sequelize.BIGINT,
  },
);
