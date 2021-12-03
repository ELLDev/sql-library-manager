const express = require("express");
const router = express.Router();
const Book = require("../models").Book;

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

// router.get("/", function (req, res, next) {
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render("index", { books });
    // res.render('index', { title: 'Express' });
    // console.log(books.map((book) => book.toJSON()));
  })
);

module.exports = router;
