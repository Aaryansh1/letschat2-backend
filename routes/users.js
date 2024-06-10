var express = require("express");
var router = express.Router();
const randomToken = require("rand-token");
const httpStatus = require("http-status");
const userOperationsPath = require("../dbOperations/userOperations");
const Response = require("../helper/Response");
const multer = require("multer");
const uuid = require("node-uuid");
const userOperations = new userOperationsPath.userOperations();
var validator = require("validator");
const userHelper = require("../helper/userHelper");
router.get("/", async function (req, res) {
  res.send(new Response(httpStatus.OK, "Success", null, false, null));
});

function validateEmail(email) {
  if (validator.isEmail(email)) {
    return true;
  }
  return false;
}
router.post("/signup", multer().none(), async (req, res, next) => {
  console.log(`req.body.email`, req.body);
  let model = {
    id: uuid.v4(),
    email: req.body.email,
    username: req.body.username,
  };
  let data = {
    user_id: model.id,
    email: req.body.email,
  };
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
  userOperations.checkEmailExistence(model.email).then((result) => {
    console.log(`result`, result);
    if (result === false) {
      console.log(`res`, result);
      userOperations.signup(model).then((result) => {
        console.log(`sign up res`, result);
        userHelper.generateNewPass(req.body.password, data).then(() => {
          res.send(
            new Response(httpStatus.OK, "User Created", result, true, null)
          );
          return result;
        });
      });
    } else {
      res.send(
        new Response(httpStatus.OK, "Email already used", result, false, null)
      );
    }
  });
});
router.post("/checktoken", async (req, res, next) => {
  console.log(`req.headers`, req.headers);
   await userOperations
     .checkToken(req.headers.userid, req.headers.token)
     .then(async (result) => {
       const time = new Date();
       if (!result) {
         res.send(
           new Response(httpStatus.OK, "User Does not Exist", null, false, null)
         );
       } else if (result.timeStamp < time.getMilliseconds()) {
         res.send(
           new Response(httpStatus.OK, "Token Expired", null, false, null)
         );
       }
       else{
         res.send(
           new Response(httpStatus.OK, "Token Valid", null, true, null)
         );
       }
     });
});
router.post("/logout", async (req, res, next) => {
  console.log(`req.headers`, req.headers);
  await userOperations.logout(req.headers.userid).then(async (result) => {
    if (!result) {
      res.send(
        new Response(httpStatus.OK, "User Does not Exist", null, false, null)
      );
    } else {
      res.send(
        new Response(httpStatus.OK, "User Logged Out", null, true, null)
      );
    }
  });
});
router.post("/signin", async (req, res, next) => {
  let model = {
    email: req.body.email,
    password: req.body.password,
  };
  userOperations.findUserByEmail(model.email).then((profile) => {
    if (profile) {
      userHelper.getPass(model.password, model.email).then((result) => {
        userOperations
          .passwordCheck(profile.id, model.password)
          .then((result) => {
            if (!result) {
              res.send(
                new Response(
                  httpStatus.OK,
                  "Wrong Password",
                  result,
                  false,
                  null
                )
              );
            } else {
              userOperations.checkLogin(profile.id).then((result) => {
                if (result) {
                  let token = randomToken.generate(30);
                  userOperations.updateToken(profile.id, token);
                  res.send(
                    new Response(
                      httpStatus.OK,
                      "Logged In",
                      { token: token, userdata: profile },
                      true,
                      null
                    )
                  );
                }
                else{
                  res.send(
                    new Response(
                      httpStatus.OK,
                      "User Already Logged In",
                      null,
                      false,
                      null
                    )
                  );
                }
              });
            }
          });
      });
    } else {
      res.send(
        new Response(
          httpStatus.OK,
          "Email or username not registered",
          null,
          false,
          null
        )
      );
    }
  });
});
module.exports = router;
