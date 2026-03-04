const express = require("express");
const {
  addProduct,
  getAllProducts,
  getProductById,
} = require("../controllers/productController");
const router = express.Router();

router.post("/add-product", addProduct);
router.get("/products", getAllProducts);
router.get("/product/:id", getProductById);

module.exports = router;
