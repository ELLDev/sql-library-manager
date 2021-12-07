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

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    templateData = { books };
    res.render("index", templateData);
  })
);

router.get("/new", (req, res) => {
  res.render("new-book");
});

router.post("/new", (req, res) => {
  // TODO
});

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    templateData = { book };
    res.render("update-book", templateData);
  })
);

module.exports = router;
