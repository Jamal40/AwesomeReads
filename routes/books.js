const router = require("express").Router();
const verify = require("../verifyToken");
const Books = require("../models/Book");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../verifyToken");
const Book = require("../models/Book");
const Review = require("../models/Review");
const mongoose = require("mongoose");

router.get("/", auth, async (req, res) => {
  let showLoved = req.query?.show;
  let showSearched = req.query?.search || " ";
  let resultBooks;
  const user = await User.findById(req.user?._id);
  const books = await Books.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "bookId",
        as: "Ratings",
      },
    },
    {
      $project: {
        name: 1,
        author: 1,
        description: 1,
        imgLink: 1,
        Ratings: {
          $map: {
            input: "$Ratings",
            as: "rates",
            in: "$$rates.rating",
          },
        },
      },
    },
  ]);
  const searchedBooks = await Books.aggregate([
    {
      $search: {
        text: {
          query: showSearched,
          path: ["name", "author"],
          fuzzy: {
            maxEdits: 2,
            maxExpansions: 100,
          },
        },
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "bookId",
        as: "Ratings",
      },
    },
    {
      $project: {
        name: 1,
        author: 1,
        description: 1,
        imgLink: 1,
        Ratings: {
          $map: {
            input: "$Ratings",
            as: "rates",
            in: "$$rates.rating",
          },
        },
      },
    },
  ]);

  resultBooks = showSearched !== " " ? searchedBooks : books;

  for (book of resultBooks) {
    let avg = getAverage(...book.Ratings);
    book.rating = isNaN(avg) ? 0 : avg;
  }

  res.render("books", {
    books: resultBooks,
    user: user,
    showLoved: showLoved,
  });
});

router.get("/:id", auth, async (req, res) => {
  let alreadyReviewed = false;
  const user = await User.findById(req.user?._id);
  const reviews = await Review.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "bookId",
        foreignField: "_id",
        as: "book",
      },
    },
    {
      $match: {
        bookId: mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
    {
      $unwind: {
        path: "$book",
      },
    },
    {
      $project: {
        review: 1,
        userId: 1,
        bookId: 1,
        rating: 1,
        date: 1,
        name: "$user.name",
        book: 1,
      },
    },
  ]);

  for (const review of reviews) {
    if (user && review.userId.toString() == user._id.toString()) {
      alreadyReviewed = true;
    }
  }

  const relatedBook = await Book.findOne({
    _id: mongoose.Types.ObjectId(req.params.id),
  });
  const ratingsResult = await Book.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "bookId",
        as: "ratings",
      },
    },
    {
      $project: {
        _id: 0,
        ratings: {
          $map: {
            input: "$ratings",
            as: "rates",
            in: "$$rates.rating",
          },
        },
      },
    },
  ]);

  const { ratings } = ratingsResult[0];

  // console.log(ratings);

  const avgRate = isNaN(getAverage(...ratings)) ? 0 : getAverage(...ratings);

  res.render("book_details", {
    reviews: reviews,
    relatedBook: relatedBook,
    relatedRate: avgRate,
    user: user,
    alreadyReviewed: alreadyReviewed,
  });
});

router.get("/favouriteAdd/:id", auth, async (req, res) => {
  const user = await User.findById(req.user?._id);
  user.favouriteBooks.push(mongoose.Types.ObjectId(req.params.id));
  await user.save();

  res.redirect("back");
});

router.get("/favouriteRemove/:id", auth, async (req, res) => {
  const user = await User.findById(req.user?._id);

  user.favouriteBooks = user.favouriteBooks.filter((favBook) => {
    return favBook.toString() != req.params.id.toString();
  });

  await user.save();

  res.redirect("back");
});
module.exports = router;

function getAverage(...numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum / numbers.length;
}

let x = {
  _id: { $oid: "605aa0f644e37f1214561dbc" },
  review: "The book is so good",
  userId: { $oid: "6057d72ce212358b4c0bb00f" },
  bookId: { $oid: "60592fb7cb95c7e6ce5cfde9" },
  rating: 4.8,
  date: { $date: "2021-03-20T05:25:00.000Z" },
};
