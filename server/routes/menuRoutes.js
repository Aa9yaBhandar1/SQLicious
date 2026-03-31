require('dotenv').config();
const express = require("express");
const router = express.Router();
const menuModel = require("../models/menuModel");
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");

//get Menu
router.get('/:id/menu', async (req, res)=> {
    try{
        const {id} = req.params;
        const menuItems = await menuModel.getMenuByRestaurant(id) ;
        res.status(200).json(menuItems);
    }catch(err){
        res.status(500).json({message: "Error fetching menu", error: err.message})
    }
});

//add menu
router.post('/:id/menu', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({ 
        message: "Missing required fields: name, price, category" 
      });
    }

    const result = await new Promise((resolve, reject)=> {
                cloudinary.uploader.upload_stream(
                    { folder: 'menus'},
                    (error, result) => {
                        if(error) reject(error);
                        else resolve (result);
                    }
                ).end(req.file.buffer);
            });
    
    const image_url = result.secure_url;
    const menu = await menuModel.addMenuItem(id, name, price, category, image_url);

    res.status(201).json({
      message: "Menu item added successfully",
      menu: menu
    });
 } catch (err) {
    console.error("Error adding menu item:", err);
    res.status(500).json({
      message: "Error adding menu item",
      error: err.message
    });
  }
});

//update menu
router.put('/menu/:item_id', async (req, res)=> {
    try{
        const {item_id} = req.params;
        const { name, price, category } = req.body;
        const updatedMenu = await menuModel.updateMenuItem(
            item_id, name, price, category
        ) 
        res.status(200).json(updatedMenu);
    }catch(err){
        res.status(500).json({message: "Error Updating menu", error: err.message})
    }
});

//delete menu
router.delete('/menu/:item_id', async (req, res)=> {
    try{
        const {item_id} = req.params;
        const deletedItem = await menuModel.deleteMenuItem(item_id) 
        res.status(200).json({message:"Item deleted", deletedItem});
    }catch(err){
        res.status(500).json({message: "Error fetching menu", error: err.message})
    }
});

module.exports = router;