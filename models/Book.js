const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imgLink: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("books", bookSchema);
