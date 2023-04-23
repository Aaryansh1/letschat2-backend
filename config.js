var { Sequelize } = require("sequelize");
var config = (Sequelize.Options = {
  host: "localhost",
  port: 5432,
  dialect: "postgresql",
  username: "postgres",
  password: "a",
  database: "",
});
var setConnection = function () {
  return new Sequelize("", "", "", config);
};
exports.sequelize = new Sequelize("", "", "", config);
 
exports.setConnection = setConnection;