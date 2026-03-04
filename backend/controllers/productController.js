const db = require("../services/dbService");

// Add product
const addProduct = (req, res) => {
  const {
    name,
    manufacturer,
    price,
    description,
    stock_quantity,
    warranty_period,
    posted_by,
  } = req.body;
  const query = `INSERT INTO component (name, manufacturer, price, description, stock_quantity, warranty_period, posted_by) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      name,
      manufacturer,
      price,
      description,
      stock_quantity,
      warranty_period,
      posted_by,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res
        .status(201)
        .json({
          message: "Product added successfully",
          productId: result.insertId,
        });
    },
  );
};

// Get all products
const getAllProducts = (req, res) => {
  db.query("SELECT * FROM component", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get product by ID
const getProductById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM component WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "Product not found" });
    res.json(result[0]);
  });
};

module.exports = { addProduct, getAllProducts, getProductById };
