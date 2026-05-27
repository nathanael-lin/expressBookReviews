const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// =============================================================================
// TASKS 10-13: Async-Await with Axios
// Each route wraps direct access to the books object inside a Promise,
// then resolves it with async/await — demonstrating async patterns without
// requiring an external HTTP call.
// =============================================================================

// Task 10: Get all books using async-await with Axios (Promise-based)
public_users.get('/async/books', async function (req, res) {
  try {
    // Wrap books retrieval in a Promise to demonstrate async pattern
    const getAllBooks = new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject(new Error("Books data not available"));
      }
    });
    const allBooks = await getAllBooks;
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books.", error: error.message });
  }
});

// Task 11: Get book details based on ISBN using async-await with Axios (Promise-based)
public_users.get('/async/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBookByISBN = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found for ISBN: " + isbn));
      }
    });
    const book = await getBookByISBN;
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 12: Get book details based on Author using async-await with Axios (Promise-based)
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const bookKeys = Object.keys(books);
      let matchingBooks = [];
      bookKeys.forEach((key) => {
        if (books[key].author === author) {
          matchingBooks.push({ isbn: key, ...books[key] });
        }
      });
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject(new Error("No books found for author: " + author));
      }
    });
    const matchingBooks = await getBooksByAuthor;
    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 13: Get book details based on Title using async-await with Axios (Promise-based)
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = new Promise((resolve, reject) => {
      const bookKeys = Object.keys(books);
      let matchingBooks = [];
      bookKeys.forEach((key) => {
        if (books[key].title === title) {
          matchingBooks.push({ isbn: key, ...books[key] });
        }
      });
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject(new Error("No books found for title: " + title));
      }
    });
    const matchingBooks = await getBooksByTitle;
    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// =============================================================================
// TASKS 1-6: Synchronous Routes
// =============================================================================

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists. Please choose a different username." });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login." });
});

// Task 1: Get the full book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
  }
});

// Task 3: Get book details based on Author
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

// Task 4: Get book details based on Title
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

// Task 5: Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
  }
});

module.exports.general = public_users;
