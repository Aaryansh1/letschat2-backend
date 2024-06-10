var express = require("express");
var router = express.Router();

let noSignUpRoutes = [
    "/",
    "/users/signup",
    "/users/signin",
]

exports.noSignUpRoutes = [...noSignUpRoutes];