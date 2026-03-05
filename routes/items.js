// CRUD routes for lost and found items
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { body, validationResult } = require("express-validator");

// CREATE
// Security validation using express-validator
router.post(
  "/",
  [
    body("title").notEmpty().trim().escape(),
    body("description").notEmpty().trim().escape(),
    body("category").isIn(["Lost", "Found"]),
    body("location").notEmpty().trim().escape(),
    body("date").isDate(),
    body("contact").notEmpty().trim().escape(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { title, description, category, location, date, contact } =
      req.body;

    const sql =
      "INSERT INTO items (title, description, category, location, date, contact) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(
      sql,
      [title, description, category, location, date, contact],
      (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Item created successfully" });
      }
    );
  }
);

// READ
router.get("/", (req, res) => {
  db.query("SELECT * FROM items", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// UPDATE STATUS
router.put("/:id", (req, res) => {
  const { status } = req.body;
  const sql = "UPDATE items SET status = ? WHERE id = ?";
  db.query(sql, [status, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Status updated" });
  });
});

// DELETE
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM items WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Item deleted" });
  });
});

module.exports = router;