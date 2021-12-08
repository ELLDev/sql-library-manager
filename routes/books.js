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
  templateData = {
    book: {
      title: "Book Title",
      author: "Author Name",
      genre: "Genre",
      year: 1995,
    },
  };
  res.render("new-book", templateData);
});

// Create
router.post(
  "/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books/");
    } catch (error) {
      console.log(error);
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        templateData = {
          book,
          errors: error.errors,
        };
        res.render("new-book", templateData);
      } else {
        throw error;
      }
    }
  })
);

// Read
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    templateData = { book };
    res.render("update-book", templateData);
  })
);

// Update
router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      await book.update(req.body);
      res.redirect("/books/");
    } catch (error) {
      console.log(error);
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        templateData = {
          book,
          errors: error.errors,
        };
        res.render("update-book", templateData);
      } else {
        throw error;
      }
    }
  })
);

// Delete
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books");
  })
);

module.exports = router;
