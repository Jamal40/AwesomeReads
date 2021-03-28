const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers.cookie?.split("=")[1];
  if (!token) {
    //  return res.status(401).send("Access Denied");
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    //console.log(verified);
    req.user = verified;
  } catch (err) {
    //res.status(400).send("Invalid Token");
  }
  next();
}

module.exports = auth;
