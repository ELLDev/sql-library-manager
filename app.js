const createError = require("http-errors");
const express = require("express");
const path = require("path");

const indexRouter = require("./routes/index");
const bookRouter = require("./routes/books");

const db = require("./models/index");
const app = express();

// view engine setup
// app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "public")));
app.use("/static", express.static("public"));

app.use("/", indexRouter);
app.use("/books", bookRouter);

(async () => {
  try {
    // await db.sequelize.sync({ force: true });
    await db.sequelize.sync();
    await db.sequelize.authenticate();
    console.log("Connection to the database successful!");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
})();


app.use((req, res) => {
  const err = new Error();
  err.status = 404;
  err.message = "Page not found";
  console.error("The requested route was not found.");
  res.render("page-not-found");
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  if (!err.status) err.status = 500;
  if (!err.message) err.message = "Internal Server Error";
  res.render("error");
});


module.exports = app;
