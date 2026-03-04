const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const rentalItemRoutes = require("./routes/rentalItemRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", rentalItemRoutes);
app.use("/api", productRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
