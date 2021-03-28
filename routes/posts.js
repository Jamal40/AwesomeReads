const router = require("express").Router();
const verify = require("../verifyToken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", verify, (req, res) => {
  // console.log(req.user);
  res.send("You are in a private page my nigga" + req.user);
});

module.exports = router;
