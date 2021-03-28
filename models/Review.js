const Mongoose = require("mongoose");
const ObjectId = Mongoose.Schema.Types.ObjectId;

const reviewSchema = new Mongoose.Schema({
  review: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    required: true,
  },
  bookId: {
    type: ObjectId,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    max: 5,
    min: 0,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = Mongoose.model("reviews", reviewSchema);
