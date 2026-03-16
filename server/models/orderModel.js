const pool = require('../config/db');

const createOrder = async (user_id, restaurant_id, total_price, items) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert into orders
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, restaurant_id, total_price) 
             VALUES ($1, $2, $3) RETURNING order_id`,
            [user_id, restaurant_id, total_price]
        );
        const orderId = orderResult.rows[0].order_id;

        // Insert into order_items (looping through the cart)
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, item_id, quantity) 
                 VALUES ($1, $2, $3)`,
                [orderId, item.item_id, item.quantity]
            );
        }

        await client.query('COMMIT');
        return { orderId, status: 'success' };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    createOrder
};