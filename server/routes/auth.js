const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const userModel = require("../models/userModel");
const verifyToken = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/sign-up", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.createUser(name, email, hashedPassword, role);
        res.status(201).json({
            message: "User registered successfully",
            user: { user_id: user.user_id, role: user.role, name: user.name }
        });
    } catch (err) {
        res.status(500).json({ error: "Server error during registration", details: err.message });
    }
});

//Sign In
router.post("/sign-in", async(req, res)=>{
    try{
        const {email, password} = req.body ;
        const user = await userModel.findUserByEmail(email);
        if(!user)
            return res.status(401).json({error:"Authentication failed"});
    
        const passwordMatch = await bcrypt.compare (password, user.password);
        if(!passwordMatch)
            return res.status(401).json({error: "Authentication failed"});


        const token = jwt.sign(
            {
                user_id: user.user_id,
                role:user.role,
                name:user.name,
                restaurant_id: user.restaurant_id
            },
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );
        res.status(200).json({token, user});
    } catch(err){
        res.status(500).json({error: "Login Failed"});
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