const router = require("express").Router();
const Review = require("../models/Review");
const User = require("../models/User");
const mongoose = require("mongoose");
const auth = require("../verifyToken");
const Book = require("../models/Book");
router.get("/delete/:id", async (req, res) => {
  await Review.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) });
  res.redirect("back");
});

router.get("/edit/:id", auth, async (req, res) => {
  const user = await User.findById(req.user?._id);
  const reviewToEdit = await Review.findById(req.params.id);
  res.render("review_edit", { review: reviewToEdit, user: user });
});

router.post("/edit/:id", async (req, res) => {
  let editedReview = await Review.findById(req.params.id);
  editedReview.review = req.body.reviewContent;
  editedReview.rating = req.body.rate;
  editedReview.date = new Date(Date.now());
  editedReview = await editedReview.save();

  res.redirect(`/api/books/${editedReview.bookId}`);
});

router.get("/add/:id", auth, async (req, res) => {
  const user = await User.findById(req.user?._id);
  const relatedBook = await Book.findById(req.params.id);

  res.render("review_add", { user: user, relatedBook: relatedBook });
});

router.post("/add/:id", auth, async (req, res) => {
  try {
    await Review.insertMany([
      {
        review: req.body.review,
        userId: mongoose.Types.ObjectId(req.user._id),
        bookId: mongoose.Types.ObjectId(req.params.id),
        rating: req.body.rating,
        date: new Date(Date.now()),
      },
    ]);
  } catch (err) {
  } finally {
    res.redirect(`/api/books/${req.params.id}`);
  }
});

module.exports = router;
