var express = require("express");
var router = express.Router();
const httpStatus = require("http-status");
const userOperationsPath = require("../dbOperations/userOperations");
const Response = require("../helper/Response");
const multer = require("multer");
const userOperations = new userOperationsPath.userOperations();
router.get('/',async function (req, res) {
    res.send('Hello World!');
});
var validator = require("validator");

function validateEmail(email) {
  if (validator.isEmail(email)) {
    return true;
  }
  return false;
}
router.post('/signup',multer().none(), async (req, res, next) => {
  console.log(`req.body.email`,req.body);
  let model = {
    email: req.body.email
  }
  if (!req.body.email || !validateEmail(req.body.email)) {
    res.send(
      new Response(
        httpStatus.OK,
        "Please enter a valid email address.",
        null,
        false,
        null
      )
    );
    return;
  }
  userOperations.signup(model)
});

module.exports = router;