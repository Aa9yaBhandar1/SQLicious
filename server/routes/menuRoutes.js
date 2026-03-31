const express = require("express");
const router = express.Router();
const menuModel = require("../models/menuModel");
const authorize = require("../middleware/authMiddleware");

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
router.post('/:id/menu', async (req, res)=> {
    try{
        const {id} = req.params;
        const { name, price, category } = req.body;
        const item = await menuModel.addMenuItem(id, name, price, category); 
        res.status(200).json(item);
    }catch(err){
        res.status(500).json({message: "Error Adding menu", error: err.message})
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