const router = require("express").Router();
const User = require("../models/User");
const Book = require("../models/Book");
const mongoose = require("mongoose");
const auth = require("../verifyToken");

router.get("/", auth, async (req, res) => {
  const currentUser = await User.findById(req?.user._id);
  if (currentUser?.role == "admin") {
    return res.render("admin_dashboard");
  }
  return res.redirect("/api/user/login");
});

router.get("/users", auth, async (req, res) => {
  const currentUser = await User.findById(req?.user._id);
  if (currentUser?.role == "admin") {
    const searchText = req.query?.search;
    const users = await User.find({});
    let resultUsers = users;
    if (searchText) {
      const searchedUsers = await User.aggregate([
        {
          $search: {
            index: "usersIndex",
            text: {
              query: searchText,
              path: ["name", "role"],
              fuzzy: {
                maxEdits: 2,
                maxExpansions: 100,
              },
            },
          },
        },
      ]);

      resultUsers = searchedUsers;
    }
    return res.render("users_management", {
      users: resultUsers,
      currentUser: currentUser,
    });
  }
  return res.redirect("/api/user/login");
});

router.delete("/users/:id", auth, async (req, res) => {
  const currentUser = await User.findById(req?.user._id);
  if (currentUser?.role == "admin") {
    await User.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) });
    return res.redirect("back");
  }
  return res.redirect("/api/user/login");
});

router.put("/users/:id", auth, async (req, res) => {
  const currentUser = await User.findById(req?.user._id);
  if (currentUser?.role == "admin") {
    await User.updateOne(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      { $set: { role: req.body.role } }
    );
    return res.redirect("back");
  }
  return res.redirect("/api/user/login");
});

router.delete("/books/remove/:id", auth, async (req, res) => {
  const currentUser = await User.findById(req?.user._id);
  if (currentUser?.role == "admin") {
    await Book.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) });
    return res.redirect("back");
  }
  return res.redirect("/api/user/login");
});

router.get("/books/edit/:id", auth, async (req, res) => {
  const currentUser = await User.findById(req?.user._id);
  if (currentUser?.role == "admin") {
    const book = await Book.findById(req.params?.id);
    return res.render("book_edit", { currentUser: currentUser, book: book });
  }
  return res.redirect("/api/user/login");
});

router.put("/books/edit/:id", auth, async (req, res) => {
  const currentUser = await User.findById(req?.user._id);
  if (currentUser?.role == "admin") {
    const book = await Book.updateOne(
      { _id: req.params?.id },
      {
        $set: {
          name: req.body.name,
          author: req.body.author,
          description: req.body.description,
          imgLink: req.body.imgLink,
        },
      }
    );
    return res.redirect("/api/books");
  }
  return res.redirect("/api/user/login");
});

router.get("/books/add", auth, async (req, res) => {
  const currentUser = await User.findById(req?.user._id);
  if (currentUser?.role == "admin") {
    return res.render("book_add", { currentUser: currentUser });
  }
  return res.redirect("/api/user/login");
});

router.post("/books/add", auth, async (req, res) => {
  const currentUser = await User.findById(req?.user._id);
  if (currentUser?.role == "admin") {
    await Book.insertMany([
      {
        name: req.body.name,
        author: req.body.author,
        description: req.body.description,
        imgLink: req.body.imgLink,
      },
    ]);
    return res.redirect("/api/books");
  }
  return res.redirect("/api/user/login");
});
module.exports = router;
