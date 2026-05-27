const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if username already exists
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists. Please choose a different username." });
  }

  // Register the new user
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login." });
});

// Task 1: Get the book list available in the shop (synchronous)
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN (synchronous)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
  }
});

// Task 3: Get book details based on author (synchronous)
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  let matchingBooks = [];

  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for author: " + author });
  }
});

// Task 4: Get all books based on title (synchronous)
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  let matchingBooks = [];

  bookKeys.forEach((key) => {
    if (books[key].title === title) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for title: " + title });
  }
});

// Task 5: Get book review based on ISBN (synchronous)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
  }
});

// Task 10: Get all books using async-await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books.", error: error.message });
  }
});

// Task 11: Get book details based on ISBN using async-await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    return res.status(status).json({ message: "Error fetching book by ISBN.", error: error.message });
  }
});

// Task 12: Get book details based on Author using async-await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    return res.status(status).json({ message: "Error fetching books by author.", error: error.message });
  }
});

// Task 13: Get book details based on Title using async-await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    return res.status(status).json({ message: "Error fetching books by title.", error: error.message });
  }
});

module.exports.general = public_users;
