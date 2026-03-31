require('dotenv').config();

const express = require("express");
const router = express.Router();

const restaurantModel = require("../models/restaurantModel");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/uploadMiddleware");

//setup restaurant profile 
router.post("/restaurant-profile", upload.single('image'), async (req, res) => {
    try {
        const { user_id, name, address, contact } = req.body;

        console.log("Saving profile for User ID:", user_id); 

        if (!user_id || !name || !address || !contact) {
            return res.status(400).json({ error: "Missing restaurant details" });
        }

        const result = await new Promise((resolve, reject)=> {
            cloudinary.uploader.upload_stream(
                { folder: 'restaurants'},
                (error, result) => {
                    if(error) reject(error);
                    else resolve (result);
                }
            ).end(req.file.buffer);
        });

        const image_url = result.secure_url;

        const restaurant = await restaurantModel.createRestaurantProfile(user_id, name, address, contact, image_url);

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
        res.status(200).json(allRestaurants);
    }catch(err){
        res.status(500).json({message: "Error fetching restaurants", error: err.message})
    }
});

router.get('/:id', async (req, res)=> {
    const user_id = req.body;
    try {
        const getDetails = await restaurantModel.getRestaurantDetail(user_id);
        res.status(200).json(getDetails);
    }catch(err){
        res.status(500).json({message: "Error getting details about the restaurant", error: err.message})
    }
});

// router.post('/')


module.exports = router;


