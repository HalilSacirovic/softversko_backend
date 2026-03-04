const express = require("express");
const {
  addRentalItem,
  getAllRentalItems,
  getRentalItemById,
} = require("../controllers/rentalItemController");
const upload = require("../services/multerService"); // assuming multer setup for file upload
const router = express.Router();

router.post("/add-rental-item", upload.single("image"), addRentalItem);
router.get("/rental-items", getAllRentalItems);
router.get("/rental-item/:id", getRentalItemById);

module.exports = router;
