const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const pool = require("../config/db");

const userModel = require("../models/userModel");
const restaurantModel = require("../models/restaurantModel");
const verifyToken = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


//get details 
router.get("/me", verifyToken, async (req, res) => {
    try{
        const user_id = req.user.user_id;
        const details = await userModel.getUserDetails(user_id);

        res.status(200).json({
            message:"User details fetched!",
            user: details
        });
    } catch(err){
        res.status(500).json({error: "Fetch failed", details: err.message});
    }
});

//update user
router.patch("/profile-update", verifyToken, async (req, res) => { 
    const client = await pool.connect();
    try {
        const user_id = req.user.user_id; 
        const { name, email, address, contact } = req.body;
        const role = req.user.role;
        
        await client.query('BEGIN');

        const updatedUser = await userModel.updateUserDetails(name, email, user_id);

        let updatedRestaurant = null;
        if (role === 'restaurant') {
            updatedRestaurant = await restaurantModel.updateRestaurantProfile(address, contact, name, user_id); //
        }
       
        await client.query('COMMIT'); 

        res.status(200).json({ 
            message: "Profile updated successfully!",
            user: updatedUser,
            restaurant: updatedRestaurant
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Update Error:", err.message);
        res.status(500).json({ error: "Update failed", details: err.message });
    } finally {
        client.release();
    }
});


//delete user
router.delete("/delete/:id", verifyToken, async (req, res)=> {
    const user_id = req.user.user_id;
    try{
        const deletedUser = await userModel.deleteUser(user_id);

        if(!deletedUser) return res.status(404).json({message: "User not found!"})

        res.json({
            message: "User deleted successfully",
            user: deletedUser
        });
    }catch(err){
         console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }

})
module.exports = router;
