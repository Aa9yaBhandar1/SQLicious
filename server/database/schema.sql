CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('customer', 'restaurant'))
);

-- Restaurants Table
CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    name VARCHAR(100),
    address TEXT,
    contact BIGINT,
    rating DECIMAL(2,1) DEFAULT 0
);

-- Menu Items
CREATE TABLE menu_items (
    item_id SERIAL PRIMARY KEY,
    restaurant_id INT REFERENCES restaurants(restaurant_id),
    name VARCHAR(100),
    price DECIMAL(10,2),
    category VARCHAR(50)
);

-- Orders
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    restaurant_id INT REFERENCES restaurants(restaurant_id),
    status VARCHAR(20) DEFAULT 'Pending', -- Preparing, Delivered, etc.
    total_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items (Linking Table for multiple items)
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    item_id INT REFERENCES menu_items(item_id),
    quantity INT
);