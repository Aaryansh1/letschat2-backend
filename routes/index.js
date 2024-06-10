var express = require("express");
var router = express.Router();
const { noSignUpRoutes } = require("./noSignUpRoutes");
const httpStatus = require("http-status");
const Response = require("../helper/Response");
const chatOperationsPath = require("../dbOperations/chatOperations");
const chatOperations = new chatOperationsPath.chatOperations();

router.use("/", async function (req, res, next) {
  console.log(req._parsedUrl.pathname);
  if (noSignUpRoutes.indexOf(req._parsedUrl.pathname) >= 0) {
    console.log("proceed forward");
    next();
  } else {
    console.log("Path under login protection");
    next();
  }
});

router.post("/createroom", async (req, res, next) => {
  console.log(`req.body`, req.body);
  chatOperations.createRoom(req.body.room_name).then((result) => {
    if (result) {
      console.log(`result`, result);
      res.send(new Response(httpStatus.OK, "Room Created", result, true, null));
    } else {
      res.send(
        new Response(httpStatus.OK, "Room already created", null, true, null)
      );
    }
  });
});
router.get("/getrooms", async (req, res, next) => {
  chatOperations.getRooms().then((result) => {
    console.log(`result`, result);
    if (result) {
      res.send(new Response(httpStatus.OK, "Rooms", result, true, null));
    } else {
      res.send(
        new Response(httpStatus.OK, "There was an Error", null, false, null)
      );
    }
  });
});
router.post("/getmessages", async (req, res) => {
  console.log(req.body);
  chatOperations.getMessages(req.body.room_name).then((result) => {
    console.log(`resultmsg`, result);
    if (result) {
      res.send(new Response(httpStatus.OK, "Messages", result, true, null));
    } else {
      res.send(
        new Response(httpStatus.OK, "There was an Error", null, false, null)
      );
    }
  });
});

module.exports = router;
