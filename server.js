const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
//import auth from routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const booksRoute = require("./routes/books");
const reviewsRoute = require("./routes/reviews");
const adminRoute = require("./routes/manager");
const methodOverride = require("method-override");
dotenv.config();
mongoose.connect(
  process.env.DB_CONNECT,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("connected");
  }
);
app.use(express.static(__dirname + "/assets"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cors());
//adding middleware to use authRoute
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/books", booksRoute);
app.use("/api/reviews", reviewsRoute);
app.use("/api/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(process.env.PORT || 2007, () => {
  console.log("server is up and running");
});
