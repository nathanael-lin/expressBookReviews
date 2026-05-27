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

  return res.status(200).json({ message: "Login successful!" });
});

// Task 8: Add or modify a book review (authenticated)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!review) {
    return res.status(400).json({ message: "Review text is required as a query parameter." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
  }

  // Add or overwrite the review keyed by username
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `Review for ISBN ${isbn} by ${username} has been added/updated.`,
    reviews: books[isbn].reviews
  });
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

  return res.status(200).json({
    message: `Review for ISBN ${isbn} by ${username} has been deleted.`,
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
