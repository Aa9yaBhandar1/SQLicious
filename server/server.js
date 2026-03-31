require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Multer = require("multer");
const cloudinary = require("cloudinary").v2;

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes")
const restaurantRoutes = require("./routes/restaurantRoutes")
const menuRoutes = require("./routes/menuRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes );
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/restaurant", menuRoutes);
app.use("/api/cart", cartRoutes);

app.listen(5000, () =>
  console.log("Server running on port 5000")
);