const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const pool = require('../config/db');

const userModel = require("../models/userModel");
const verifyToken = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const restaurantModel = require("../models/restaurantModel");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/uploadMiddleware");

//Sign In
router.post("/sign-in", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findUserByEmail(email);
        if (!user)
            return res.status(401).json({ error: "Authentication failed" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            return res.status(401).json({ error: "Authentication failed" });


        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role,
                name: user.name,
                restaurant_id: user.restaurant_id
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(200).json({ token, user });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Login Failed", message: err.message });
    }
});


router.post("/register-full", upload.single('image'), async (req, res) => {
    // Get a client from the pool to handle the transaction
    const client = await pool.connect();
    
    try {
        const { name, email, password, role, resName, address, contact } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "Basic account fields are required" });
        }

        // Start Transaction
        await client.query('BEGIN');

        // Check if user exists
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: "Email already registered" });
        }

        //  Create the User
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.createUser(name, email, hashedPassword, role, client); 

        //  If Restaurant, handle Profile and Image
        if (role === 'restaurant') {
            if (!resName || !address || !contact || !req.file) {
                throw new Error("Missing restaurant profile details or image");
            }

            // Upload to Cloudinary
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'restaurants' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(req.file.buffer);
            });

            const image_url = result.secure_url;

            // Create Profile using the same transaction client
            await restaurantModel.createRestaurantProfile(
                user.user_id, 
                resName, 
                address, 
                contact, 
                image_url, 
                client
            );
        }

        //  Commit everything if we got this far
        await client.query('COMMIT');

        res.status(201).json({
            message: "Registration successful",
            user: { user_id: user.user_id, role: user.role }
        });

    } catch (err) {
        //  Rollback if ANY error occurs (User won't be created)
        await client.query('ROLLBACK');
        console.error("REGISTRATION ERROR:", err.message);
        res.status(500).json({ error: "Registration failed", details: err.message });
    } finally {
        // Release the database client back to the pool
        client.release();
    }
});

// USER DASHBOARD
router.get("/user-dashboard", verifyToken, (req, res) => {
    res.json({ message: "Welcome to user panel" });
});


// RESTAURANT DASHBOARD
router.get("/restaurant-dashboard", verifyToken, authorize("restaurant"), (req, res) => {
    res.json({ message: "Welcome to restaurant panel" });
});

module.exports = router;