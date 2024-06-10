var models = require("../models/index");
const randomToken = require("rand-token");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
class userOperations {
  constructor() {}
  async signup(model) {
    if (model) {
      let newUser = await models.users.create(model);
      let token = await this.createOrUpdateToken(
        model.id,
        randomToken.generate(30)
      );
      return {
        user: newUser,
        token: token.token,
      };
    }
  }

  async checkEmailExistence(email) {
    let userExist = await models.users.findOne({ where: { email: email } });
    if (userExist) {
      return true;
    } else {
      return false;
    }
  }

  async createOrUpdateToken(id, token) {
    console.log(`id`, id, token);
    let model = {
      user_id: id,
      token: token,
      timestamp: new Date().setHours(new Date().getHours() + 24 * 30),
    };
    const prev_tokens = await models.logged_users.findAll({
      where: { user_id: id },
      order: [["timestamp", "DESC"]],
    });
    prev_tokens.length === 3
      ? await models.logged_users.destroy({
          where: { token: prev_tokens.pop().token },
        })
      : null;
    return models.logged_users.create(model);
  }
  async fetchAuthentication(token) {
    var findOptions = {};
    findOptions.where = {
      token: token,
      timestamp: { [Op.gt]: new Date().getTime() },
    };
    let data = await models.logged_users.findOne(findOptions);
    return data;
  }
  async checkToken(userid, token) {
    var findOptions = {};
    findOptions.where = { user_id: userid, token: token };
    return models.logged_users.findOne(findOptions);
  }
  async logout(userid) {
    var findOptions = {};
    findOptions.where = { user_id: userid };
    return models.logged_users.destroy(findOptions);
  }
  async findUserByEmail(email) {
    var findOptions = {};
    findOptions.where = { email: email };
    return models.users.findOne(findOptions);
  }
  async passwordExists(userid) {
    var findOptions = {
      where: { user_id: userid },
    };
    return await models.passwords.findOne(findOptions);
  }
  async newPassword(model) {
    const buildOptions = {};
    buildOptions.isNewRecord = true;
    buildOptions.raw = true;
    return models.passwords.create(model, buildOptions);
  }
  async changePassword(model) {
    let userdata = await models.passwords.findOne({
      where: { user_id: model.user_id },
    });
    if (userdata) {
      return userdata.update(model);
    } else {
      return models.passwords.create(model);
    }
  }
  async getSalt(email) {
    let data = await models.passwords.findOne({
      where: {
        email: email,
      },
    });
    console.log(`data`, data);
    return data ? data.dataValues.salt : null;
  }
  async findUserByEmail(email) {
    let user = await models.users.findOne({
      where: {
        email: {
          [Op.iLike]: "%" + email + "%",
        },
      },
    });
    if (user) {
      console.log(`user`, user);
      return user;
    } else {
      return false;
    }
  }
  async passwordCheck(user_id, password) {
    var findOptions = {};
    findOptions.where = {
      user_id,
    };
    let pass = await models.passwords.findOne(findOptions);
    if (!pass) {
      return "nopass";
    }
    return bcrypt.compareSync(password, pass.password);
  }
  async updateToken(id, token) {
    let model = {
      user_id: id,
      token: token,
      timestamp: new Date().setHours(new Date().getHours() + 24 * 30),
    };
    const prev_tokens = await models.logged_users.findAll({
      where: { user_id: id },
      order: [["timestamp", "DESC"]],
    });
    prev_tokens.length === 3
      ? await models.logged_users.destroy({
          where: { token: prev_tokens.pop().token },
        })
      : null;
    var buildOptions = {};
    buildOptions.isNewRecord = true;
    buildOptions.raw = true;
    return models.logged_users.create(model, buildOptions);
  }
  async checkLogin(id) {
    var findOptions = {};
    findOptions.where = {
      user_id: id,
    };
    let data = await models.logged_users.findOne(findOptions);
    if (data) {
      return false;
    } else {
      return true;
    }
  }
}
exports.userOperations = userOperations;
