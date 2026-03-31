const pool = require('../config/db');

const addToCartDB = async (user_id, restaurant_id, item_id, quantity) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        let cartRes = await client.query('SELECT cart_id, restaurant_id FROM cart WHERE user_id = $1', [user_id]);
        let cartId;

        if (cartRes.rows.length === 0) {
            const newCart = await client.query(
                'INSERT INTO cart (user_id, restaurant_id) VALUES ($1, $2) RETURNING cart_id',
                [user_id, restaurant_id]
            );
            cartId = newCart.rows[0].cart_id;
        } else {
            cartId = cartRes.rows[0].cart_id;
            if (cartRes.rows[0].restaurant_id !== parseInt(restaurant_id)) {
                await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
                await client.query('UPDATE cart SET restaurant_id = $1 WHERE cart_id = $2', [restaurant_id, cartId]);
            }
        }

        await client.query(
            `INSERT INTO cart_items (cart_id, item_id, quantity) 
             VALUES ($1, $2, $3)
             ON CONFLICT (cart_id, item_id) 
             DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
            [cartId, item_id, quantity]
        );

        await client.query('COMMIT');
        return { success: true };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};


const getCartByUserId = async (user_id) => {
    const query = `
        SELECT 
            ci.cart_item_id, 
            mi.name, 
            mi.price, 
            mi.category, 
            ci.quantity,
            (mi.price * ci.quantity) AS subtotal
        FROM cart c
        JOIN cart_items ci ON c.cart_id = ci.cart_id
        JOIN menu_items mi ON ci.item_id = mi.item_id
        WHERE c.user_id = $1
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
};

const removeItemFromCart = async (user_id, cart_item_id) => {
    const query = `
        DELETE FROM cart_items 
        WHERE cart_item_id = $1 
        AND cart_id = (SELECT cart_id FROM cart WHERE user_id = $2)
    `;
    const result = await pool.query(query, [cart_item_id, user_id]);
    return result.rowCount > 0; 
};

const clearCartDB = async (user_id) => {
    const query = `
        DELETE FROM cart_items 
        WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = $1)
    `;
    await pool.query(query, [user_id]);
};




module.exports = {
    addToCartDB,
    getCartByUserId,
    removeItemFromCart,
    clearCartDB
};