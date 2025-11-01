const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../books.json");

const getBooks = () => {
  const data = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(data);
};

let books = getBooks();

router.get("/", (req, res) => {
  res.render("index", { title: "Домашня бібліотека", books: books });
});

router.get("/book/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).send("Книгу не знайдено");
  }
  res.render("book", { title: book.title, book: book });
});

router.get("/api/books", (req, res) => {
  let filteredBooks = [...books];
  const { inStock, overdue } = req.query;

  if (inStock === "true") {
    filteredBooks = filteredBooks.filter((b) => b.inStock);
  }

  if (overdue === "true") {
    const today = new Date().setHours(0, 0, 0, 0);
    filteredBooks = filteredBooks.filter((b) => {
      return !b.inStock && b.returnDate && new Date(b.returnDate) < today;
    });
  }

  res.json(filteredBooks);
});

router.post("/api/books", (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const newId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
  const newBook = {
    id: newId,
    title,
    author,
    year: parseInt(year),
    inStock: true,
    readerName: null,
    returnDate: null,
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

router.delete("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Not Found" });
  }

  books.splice(bookIndex, 1);
  res.status(200).json({ message: "Book deleted" });
});

router.put("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);
  const { title, author, year } = req.body;

  if (!book) {
    return res.status(404).json({ message: "Not Found" });
  }
  if (!title || !author || !year) {
    return res.status(400).json({ message: "Bad Request" });
  }

  book.title = title;
  book.author = author;
  book.year = parseInt(year);

  res.json(book);
});

router.put("/api/books/checkout/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);
  const { readerName, returnDate } = req.body;

  if (!book || !book.inStock || !readerName || !returnDate) {
    return res.status(400).json({ message: "Bad Request" });
  }

  book.inStock = false;
  book.readerName = readerName;
  book.returnDate = returnDate;

  res.json(book);
});

router.put("/api/books/return/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book || book.inStock) {
    return res.status(400).json({ message: "Bad Request" });
  }

  book.inStock = true;
  book.readerName = null;
  book.returnDate = null;

  res.json(book);
});

module.exports = router;
