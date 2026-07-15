-- ============================================================
-- CakeShop Database Schema (MySQL 8+)
-- ============================================================
CREATE DATABASE IF NOT EXISTS cakeshop_db;
USE cakeshop_db;

-- ------------------------------------------------------------
-- USERS (role-based: VENDOR / CUSTOMER / ADMIN)
-- ------------------------------------------------------------
CREATE TABLE users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        ENUM('VENDOR','CUSTOMER','ADMIN') NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- VENDOR PROFILE (1-1 with users)
-- ------------------------------------------------------------
CREATE TABLE vendor_profile (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL UNIQUE,
    shop_name    VARCHAR(150) NOT NULL,
    description  TEXT,
    phone        VARCHAR(20),
    shop_address VARCHAR(255),
    logo_url     VARCHAR(255),
    CONSTRAINT fk_vendor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- CUSTOMER PROFILE (1-1 with users)
-- ------------------------------------------------------------
CREATE TABLE customer_profile (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL UNIQUE,
    phone       VARCHAR(20),
    avatar_url  VARCHAR(255),
    CONSTRAINT fk_customer_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- CATEGORY / SUBCATEGORY
-- ------------------------------------------------------------
CREATE TABLE category (
    id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE subcategory (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id  BIGINT NOT NULL,
    name         VARCHAR(100) NOT NULL,
    CONSTRAINT fk_subcategory_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
    UNIQUE KEY uq_subcategory (category_id, name)
);

-- ------------------------------------------------------------
-- PRODUCT (owned by vendor, moderated by admin)
-- ------------------------------------------------------------
CREATE TABLE product (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id       BIGINT NOT NULL,
    subcategory_id  BIGINT NOT NULL,
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    base_price      DECIMAL(10,2) NOT NULL,
    image_url       VARCHAR(255),
    status          ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_vendor FOREIGN KEY (vendor_id) REFERENCES vendor_profile(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategory(id)
);

-- ------------------------------------------------------------
-- ADDRESS (belongs to customer)
-- ------------------------------------------------------------
CREATE TABLE address (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id  BIGINT NOT NULL,
    line1        VARCHAR(255) NOT NULL,
    line2        VARCHAR(255),
    city         VARCHAR(100) NOT NULL,
    state        VARCHAR(100) NOT NULL,
    pincode      VARCHAR(10) NOT NULL,
    is_default   BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_address_customer FOREIGN KEY (customer_id) REFERENCES customer_profile(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- CAKE CUSTOMIZATION
-- Attached to either a cart_item (pre-checkout) or an
-- order_item (post-checkout snapshot) - never both.
-- ------------------------------------------------------------
CREATE TABLE cake_customization (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT NOT NULL,
    weight_kg       DECIMAL(4,2),
    flavor          VARCHAR(100),
    shape           VARCHAR(50),
    message_on_cake VARCHAR(255),
    layers          INT,
    special_notes   TEXT,
    CONSTRAINT fk_customization_product FOREIGN KEY (product_id) REFERENCES product(id)
);

-- ------------------------------------------------------------
-- CART (1-1 with customer) / CART_ITEM
-- ------------------------------------------------------------
CREATE TABLE cart (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id  BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_cart_customer FOREIGN KEY (customer_id) REFERENCES customer_profile(id) ON DELETE CASCADE
);

CREATE TABLE cart_item (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id               BIGINT NOT NULL,
    product_id            BIGINT NOT NULL,
    cake_customization_id BIGINT UNIQUE,
    quantity              INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_cartitem_cart FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    CONSTRAINT fk_cartitem_product FOREIGN KEY (product_id) REFERENCES product(id),
    CONSTRAINT fk_cartitem_customization FOREIGN KEY (cake_customization_id) REFERENCES cake_customization(id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- ORDERS / ORDER_ITEM
-- ------------------------------------------------------------
CREATE TABLE orders (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id   BIGINT NOT NULL,
    total_amount  DECIMAL(10,2) NOT NULL,
    status        ENUM('PLACED','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PLACED',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customer_profile(id)
);

CREATE TABLE order_item (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id              BIGINT NOT NULL,
    product_id            BIGINT NOT NULL,
    vendor_id             BIGINT NOT NULL,
    cake_customization_id BIGINT UNIQUE,
    quantity              INT NOT NULL DEFAULT 1,
    unit_price            DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_product FOREIGN KEY (product_id) REFERENCES product(id),
    CONSTRAINT fk_orderitem_vendor FOREIGN KEY (vendor_id) REFERENCES vendor_profile(id),
    CONSTRAINT fk_orderitem_customization FOREIGN KEY (cake_customization_id) REFERENCES cake_customization(id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- DELIVERY (1-1 with orders)
-- ------------------------------------------------------------
CREATE TABLE delivery (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id       BIGINT NOT NULL UNIQUE,
    address_id     BIGINT NOT NULL,
    delivery_date  DATE NOT NULL,
    status         ENUM('SCHEDULED','DISPATCHED','DELIVERED','FAILED') NOT NULL DEFAULT 'SCHEDULED',
    CONSTRAINT fk_delivery_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_delivery_address FOREIGN KEY (address_id) REFERENCES address(id)
);

-- ------------------------------------------------------------
-- Helpful indexes for search/sort/filter
-- ------------------------------------------------------------
CREATE INDEX idx_product_status ON product(status);
CREATE INDEX idx_product_subcategory ON product(subcategory_id);
CREATE INDEX idx_product_vendor ON product(vendor_id);
CREATE INDEX idx_product_name ON product(name);
CREATE INDEX idx_orders_customer ON orders(customer_id);
