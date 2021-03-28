const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../verifyToken");
const { registerValidation, loginValidation } = require("../validation");
const url = require("url");

router.get("/register", auth, async (req, res) => {
  if (req.user) {
    return res.redirect("/api/books");
  }
  let errorMessage = req.query?.errorMessage;
  let name = req.query?.name;
  let email = req.query?.email;
  res.render("register", {
    errorMessage: errorMessage,
    name: name,
    email: email,
  });
});

router.get("/login", auth, async (req, res) => {
  if (req.user) {
    return res.redirect("/api/books");
  }
  let errorMessage = req.query?.errorMessage;
  let name = req.query?.name;
  let email = req.query?.email;

  res.render("login", {
    errorMessage: errorMessage,
    email: email,
  });
});

router.get("/logout", async (req, res) => {
  res.cookie("auth-token", "");
  res.redirect("/api/user/login");
});

router.post("/register", async (req, res) => {
  //validating data
  let errorMessage = "";
  const { error } = registerValidation(req.body);
  const emailExist = await User.findOne({ email: req.body.email });
  if (error) {
    errorMessage = error.details[0].message;
    res.redirect(
      url.format({
        pathname: "/api/user/register",
        query: {
          name: req.body.name,
          email: req.body.email,
          errorMessage: errorMessage,
        },
      })
    );
  } else if (emailExist) {
    errorMessage = "Email already exists";
    res.redirect(
      url.format({
        pathname: "/api/user/register",
        query: {
          name: req.body.name,
          email: req.body.email,
          errorMessage: errorMessage,
        },
      })
    );
  } else {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      favouriteBooks: [],
      role: "user",
    });

    try {
      const savedUser = await user.save();
      res.redirect("/api/user/login");
    } catch (err) {
      res.status(400).send(err);
    }
  }
});

router.post("/login", async (req, res) => {
  let errorMessage = "";
  const { error } = loginValidation(req.body);
  const user = await User.findOne({ email: req.body.email });
  if (error) {
    errorMessage = error.details[0].message;
    res.redirect(
      url.format({
        pathname: "/api/user/login",
        query: {
          email: req.body.email,
          errorMessage: errorMessage,
        },
      })
    );
  } else if (!user) {
    errorMessage = "Email doesn't exist";
    res.redirect(
      url.format({
        pathname: "/api/user/login",
        query: {
          email: req.body.email,
          errorMessage: errorMessage,
        },
      })
    );
  } else {
    const valiPassword = await bcrypt.compare(req.body.password, user.password);

    if (!valiPassword) {
      errorMessage = "Invalid Password";
      res.redirect(
        url.format({
          pathname: "/api/user/login",
          query: {
            name: req.body.name,
            email: req.body.email,
            errorMessage: errorMessage,
          },
        })
      );
    } else {
      ///create and assign a token
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      res.cookie("auth-token", token);
      res.redirect("/api/books");
    }
  }
});

module.exports = router;
