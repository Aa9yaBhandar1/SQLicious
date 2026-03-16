const express = require("express");
const router = express.Router();
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


//Get all restaurants 
router.get('/', async (req, res)=> {
    try {
        const allRestaurants = await restaurantModel.getAllRestaurants();
        console.log(allRestaurants);
        res.status(200).json(allRestaurants);
    }catch(err){
        res.status(500).json({message: "Error fetching restaurants", error: err.message})
    }
});


module.exports = router;


