const bcrypt = require("bcrypt");
const userOperationsPath = require("../dbOperations/userOperations");
const userOperations = new userOperationsPath.userOperations();

const saltRounds = 5;

const generateNewPass = async (pass, data) => {
  let passexists = await userOperations.passwordExists(data.user_id);
  if (passexists) {
    return null;
  } else {
    let salt = await bcrypt.genSalt(saltRounds);
    let hash = await bcrypt.hash(pass, salt);
    let res = await userOperations.newPassword({
      email: data.email,
      user_id: data.user_id,
      password: hash,
      updated_at: new Date().getTime(),
    });
    if (res) {
      return true;
    } else {
      return false;
    }
  }
};

const updatePass = async (pass, data) => {
  let salt;
  let result = false;
  try {
    salt = await bcrypt.genSalt(saltRounds);
    hash = await bcrypt.hash(pass, salt);
    result = await userOperations.changePassword({
      user_id: data.user_id,
      password: hash,
      updated_at: new Date().getTime(),
      email: data.email,
    });
  } catch (err) {
    console.log("err:" + err);
    return null;
  }
  return result;
};

async function getPass(str, email) {
  let salt = await userOperations.getSalt(email);
  console.log("pass:" + salt);
  try {
    hash = bcrypt.hashSync(str, salt);
  } catch (err) {
    console.log("err:" + err);
    return null;
  }
  return hash;
}

module.exports = {
    generateNewPass: generateNewPass,
    updatePass,
    getPass,
}