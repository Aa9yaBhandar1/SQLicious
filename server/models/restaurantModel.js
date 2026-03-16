const pool = require("../config/db");

const createRestaurantProfile = async (user_id, name, address, contact) => {
    const result = await pool.query(
        `INSERT INTO restaurants (user_id, name, address, contact)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [user_id, name, address, contact]
    );
    return result.rows[0];
};

const updateRestaurantProfile = async(address, contact, name, user_id) => {
    const result = await pool.query(
        `UPDATE restaurants 
         SET address = $1, contact = $2, name = $3 
         WHERE user_id = $4 
         RETURNING *`,
        [address, contact, name, user_id]
    );
    return result.rows[0];
};

const getAllRestaurants = async()=> {
    const result = await pool.query(
        `SELECT * FROM restaurants ORDER BY name`
    );
    return result.rows;
}

const getRestaurantDetail = async(user_id)=> {
    const result = await pool.query(
        `SELECT * FROM restaurants
        WHERE user_id = $1
        RETURNING *`,
        [user_id]
    );
    return result.rows[0];
}
module.exports = { 
    createRestaurantProfile,
    updateRestaurantProfile,
    getAllRestaurants,
    getRestaurantDetail
 };