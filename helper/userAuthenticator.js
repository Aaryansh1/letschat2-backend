var userOperations =
  new (require("../dbOperations/userOperations").userOperations)();

async function validateToken(token) {
  let data = await userOperations.fetchAuthentication(token);
  return data;
}
module.exports = {
  validateToken,
};
