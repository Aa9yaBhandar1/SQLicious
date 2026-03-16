const pool = require("../config/db");

const getMenuByRestaurant = async (restaurant_id) => {
    const result = await pool.query(
        `SELECT * FROM menu_items
        WHERE restaurant_id = $1
        ORDER BY category`,
        [restaurant_id]
    );
    return result.rows;
}

const addMenuItem = async (restaurant_id, name, price, category)=> {
    const result = await pool.query(
        `INSERT INTO menu_items (restaurant_id, name, price, category)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [restaurant_id, name, price, category]
    );
    return result.rows[0];
}


const updateMenuItem = async(item_id) => {
    await pool.query(
        `UPDATE menu_items 
        SET name=$1, price=$2, category=$3
        WHERE item_id=$4
        RETURNING *`,
        [name, price, category, item_id]
    );
    return result.rows[0];
}

const deleteMenuItem = async (item_id) => {
    await pool.query(
        `DELETE FROM menu_items
        WHERE item_id=$1`,
        [item_id]
    );
};

module.exports = {
    getMenuByRestaurant,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
};
