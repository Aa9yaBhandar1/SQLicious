const pool = require("../config/db");

const createUser = async (name, email, hashedPassword, role) => {
    const result = await pool.query(
        `INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, name, role`,
        [name, email, hashedPassword, role]
    );

    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0];
}

const getUserDetails = async (user_id) => {
    const result = await pool.query(
        `SELECT u.user_id, u.name, u.email, u.role, r.address, r.contact 
             FROM users u 
             LEFT JOIN restaurants r ON u.user_id = r.user_id 
             WHERE u.user_id = $1`,
            [user_id]
    );
    return result.rows[0];
}

const updateUserDetails = async (name,email,user_id) => {
    const result = await pool.query(
      `
      UPDATE users
      SET 
        name = COALESCE($1, name),
        email = COALESCE($2, email)
      WHERE user_id = $3
      RETURNING user_id, name, email;
      `,
      [name, email, user_id]
    );

    return result.rows[0];
};

const deleteUser = async (user_id) => {
    try {
        const result = await pool.query(
            `DELETE FROM users WHERE user_id = $1 RETURNING user_id`,
            [user_id]
        );

        return result.rows[0] || null;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

module.exports = {
    createUser,
    findUserByEmail,
    updateUserDetails,
    getUserDetails,
    deleteUser
};