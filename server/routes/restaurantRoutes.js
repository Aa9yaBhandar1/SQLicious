const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const userModel = require("../models/userModel");
const restaurantModel = require("../models/restaurantModel");
const verifyToken = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


//setup restaurant profile 
router.post("/restaurant-profile", async (req, res) => {
    try {
        const { user_id, name, address, contact } = req.body;

        console.log("Saving profile for User ID:", user_id); 

        if (!user_id || !name || !address || !contact) {
            return res.status(400).json({ error: "Missing restaurant details" });
        }

        const restaurant = await restaurantModel.createRestaurantProfile(user_id, name, address, contact);

        res.status(201).json({
            message: "Restaurant profile finalized!",
            restaurant: restaurant 
        });
    } catch (err) {
        console.error("DATABASE ERROR:", err.message); 
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

module.exports = router;


