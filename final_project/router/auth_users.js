const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username exists in the users array
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Check if username and password match a record in the users array
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Task 7: Login as a registered user
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials. Check username and password." });
  }

  // Sign JWT and store in session
  let accessToken = jwt.sign({ data: username }, "access", { expiresIn: 60 * 60 });

  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({ message: "Customer successfully logged in." });
});

// Task 8: Add or modify a book review (authenticated)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
  }

  // Keying by username handles both add (new user) and modify (same user posts again)
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "The review for the book with ISBN " + isbn + " has been added/updated." });
});

// Task 9: Delete a book review (authenticated)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review found for this user on ISBN: " + isbn });
  }

  // Delete only the review belonging to the logged-in user
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Reviews for the ISBN " + isbn + " posted by the user " + username + " deleted." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
