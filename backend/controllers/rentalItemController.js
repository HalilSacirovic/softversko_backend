const db = require("../services/dbService");
const cloudinary = require("../services/cloudinaryService");

// Add rental item
const addRentalItem = (req, res) => {
  const {
    name,
    rental_price,
    description,
    item_condition,
    quantity,
    availability,
    posted_by,
  } = req.body;

  if (req.file) {
    cloudinary.uploader
      .upload(req.file.path, { folder: "rental-items" })
      .then((result) => {
        const imageUrl = result.secure_url;
        const query = `INSERT INTO rental_items (name, rental_price, description, item_condition, quantity, availability, image_url, posted_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(
          query,
          [
            name,
            rental_price,
            description,
            item_condition,
            quantity,
            availability,
            imageUrl,
            posted_by,
          ],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res
              .status(201)
              .json({ message: "Rental item added successfully!" });
          },
        );
      })
      .catch((err) => {
        console.error("Cloudinary upload error:", err);
        res.status(500).json({ message: "Error uploading image" });
      });
  } else {
    const query = `INSERT INTO rental_items (name, rental_price, description, item_condition, quantity, availability, posted_by) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(
      query,
      [
        name,
        rental_price,
        description,
        item_condition,
        quantity,
        availability,
        posted_by,
      ],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Rental item added successfully!" });
      },
    );
  }
};

// Get all rental items
const getAllRentalItems = (req, res) => {
  db.query("SELECT * FROM rental_items", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get rental item by ID
const getRentalItemById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM rental_items WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "Item not found" });
    res.json(result[0]);
  });
};

module.exports = { addRentalItem, getAllRentalItems, getRentalItemById };
