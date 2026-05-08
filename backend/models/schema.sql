-- MySQL Schema Definition

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    otp VARCHAR(6),
    otp_expiry DATETIME,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
    user_id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(255),
    mobile_number VARCHAR(20),
    address TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pricing_categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pricing_items (
    id VARCHAR(36) PRIMARY KEY,
    category_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    base_price INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES pricing_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    service_name VARCHAR(255) NOT NULL,
    total_items INT NOT NULL,
    total_price INT NOT NULL,
    delivery_charge INT NOT NULL,
    pickup_address TEXT NOT NULL,
    delivery_option VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    items JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed defaults ignores duplicates naturally if ID used is fixed UUIDs, but here to be safe we use INSERT IGNORE
INSERT IGNORE INTO pricing_categories (id, name, icon, sort_order) VALUES 
('11111111-1111-1111-1111-111111111111', 'Daily Wear', '👕', 1),
('22222222-2222-2222-2222-222222222222', 'Traditional / Ethnic', '👗', 2),
('33333333-3333-3333-3333-333333333333', 'Formal Wear', '👔', 3),
('44444444-4444-4444-4444-444444444444', 'Home Items', '🛏️', 4),
('55555555-5555-5555-5555-555555555555', 'Accessories / Others', '👟', 5);
