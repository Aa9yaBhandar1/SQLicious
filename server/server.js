const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes")
const restaurantRoutes = require("./routes/restaurantRoutes")


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes );
app.use("/api/restaurant", restaurantRoutes)

app.listen(5000, () =>
  console.log("Server running on port 5000")
);