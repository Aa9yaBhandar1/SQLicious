const express = require("express");
const router = express.Router();
require('dotenv').config();
const pool = require("../config/db");

const cartModel = require('../models/cartModel');
const verifyToken = require("../middleware/authMiddleware");


router.post("/add", verifyToken, async (req, res) => {
    try {
        const user_id = req.user.user_id; 
        const { restaurant_id, item_id, quantity } = req.body;

        if (!restaurant_id || !item_id || !quantity) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const result = await cartModel.addToCartDB(user_id, restaurant_id, item_id, quantity);
        res.status(200).json({ message: "Item added to cart", result });
    } catch (error) {
        console.error("Error in addItemToCart:", error);
        res.status(500).json({ message: "Internal Server Error" , error:error.message});
    }
});

router.get("/", verifyToken, async (req, res) => {
    try{
        const user_id = req.user.user_id;
        const details = await cartModel.getCartByUserId(user_id);

        res.status(200).json({
            message:"Cart details fetched!",
            user: details
        });
    }catch(err){
        res.status(500).json({error: "Fetch failed", details: err.message});
    }
})

router.delete("/delete/:item_id", verifyToken, async(req, res) => {
    try {
        const { item_id } = req.params;
        await cartModel.removeItemFromCart(req.user.user_id, item_id);
        res.status(200).json({ message: "Item removed" });
    } catch (error) {
        res.status(500).json({ message: "Error removing item" });
    }
})

module.exports = router;