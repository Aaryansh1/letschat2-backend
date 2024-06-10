const { Sequelize } = require("sequelize");
var sequelize = require("sequelize");
var dbConfig = require("../config");

var s = dbConfig.setConnection();

exports.s = s;

exports.users = s.define("users", {
  id: { type: sequelize.STRING, primaryKey: true, allowNull: false },
  email: sequelize.STRING,
  username: sequelize.STRING,
});
exports.logged_users = s.define(
  "logged_users",
  {
    user_id: { type: sequelize.STRING, primaryKey: true, allowNull: false },
    token: sequelize.STRING,
    timestamp: sequelize.BIGINT,
  },
  {
    timestamps: false,
    classMethods: {
      getLoggedUsers: function (logged_users) {
        var where = {};
        if (logged_users["user_id"] !== undefined)
          where["user_id"] = logged_users["user_id"];
        if (logged_users["token"] !== undefined)
          where["token"] = logged_users["token"];
        if (logged_users["timestamp"] !== undefined)
          where["timestamp"] = logged_users["timestamp"];
        return _this.find({ where: where });
      },
    },
  }
);
exports.passwords = s.define(
  "passwords",
  {
    user_id: { type: sequelize.STRING, primaryKey: true, allowNull: false },
    password: sequelize.STRING,
    email: sequelize.STRING,
    updated_at: sequelize.BIGINT,
  },
  {
    timestamps: false,
  }
);
exports.message = s.define(
  "message",
  {
    id: { type: sequelize.STRING, primaryKey: true, allowNull: false },
    user_id: sequelize.STRING,
    message: sequelize.STRING,
    timestamp: sequelize.BIGINT,
    room_name: sequelize.STRING,
    sender_name: sequelize.STRING,

  },
  {
    timestamps: false,
    freezeTableName: true,
  }
)
exports.chatroom = s.define(
  "chatroom",
  {
    id: { type: sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    room_name: sequelize.STRING,
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
)