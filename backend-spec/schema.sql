-- =============================================================================
-- Book Worm Online Bookstore - PostgreSQL Schema
-- Architecture based on AI Specialist Capstone Specifications
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Members and Roles (Member Domain)
-- -----------------------------------------------------------------------------
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'moderator')),
    gift_points INTEGER DEFAULT 500 CHECK (gift_points >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_members_email ON members(email);

-- -----------------------------------------------------------------------------
-- 2. Delivery Addresses (Shipping Domain)
-- -----------------------------------------------------------------------------
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    phone VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_member ON addresses(member_id);

-- -----------------------------------------------------------------------------
-- 3. Categories and Publishers (Catalog Domain)
-- -----------------------------------------------------------------------------
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE publishers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    country VARCHAR(100),
    website VARCHAR(255)
);

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    bio TEXT,
    avatar_url TEXT
);

-- -----------------------------------------------------------------------------
-- 4. Books and Inventory (Catalog Domain)
-- -----------------------------------------------------------------------------
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL,
    publisher_id INTEGER REFERENCES publishers(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
    format VARCHAR(50) DEFAULT 'Paperback' CHECK (format IN ('Paperback', 'Hardcover', 'eBook', 'Audiobook')),
    language VARCHAR(50) DEFAULT 'English',
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    mrp NUMERIC(10, 2) NOT NULL CHECK (mrp >= price),
    synopsis TEXT NOT NULL,
    front_cover_url TEXT NOT NULL,
    back_cover_url TEXT,
    isbn VARCHAR(20) UNIQUE,
    pages INTEGER,
    rating NUMERIC(2, 1) DEFAULT 4.5 CHECK (rating >= 1.0 AND rating <= 5.0),
    ratings_count INTEGER DEFAULT 0,
    copies_sold INTEGER DEFAULT 0,
    stock_quantity INTEGER DEFAULT 100 CHECK (stock_quantity >= 0),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new_launch BOOLEAN DEFAULT FALSE,
    delivery_days_offset INTEGER DEFAULT 3, -- Tentative delivery in N business days
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_books_category ON books(category_id);
CREATE INDEX idx_books_author ON books(author_id);
CREATE INDEX idx_books_price ON books(price);
CREATE INDEX idx_books_bestseller ON books(is_bestseller) WHERE is_bestseller = TRUE;

-- -----------------------------------------------------------------------------
-- 5. Orders and Order Items (Order Domain)
-- -----------------------------------------------------------------------------
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
    shipping_address_id UUID REFERENCES addresses(id),
    status VARCHAR(30) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    subtotal NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    gift_points_redeemed INTEGER DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    estimated_delivery DATE NOT NULL,
    cancellation_deadline TIMESTAMP WITH TIME ZONE NOT NULL, -- Current time + 48 hours
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_member ON orders(member_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_deadline ON orders(cancellation_deadline);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    format VARCHAR(50) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- -----------------------------------------------------------------------------
-- 6. Payment Processing (Payment Domain)
-- -----------------------------------------------------------------------------
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('Credit Card', 'Debit Card', 'UPI', 'Wallet', 'Gift Points')),
    transaction_reference VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(30) DEFAULT 'completed' CHECK (status IN ('initiated', 'completed', 'failed', 'refunded')),
    gateway_response JSONB,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order ON payments(order_id);

-- -----------------------------------------------------------------------------
-- 7. Reviews and Feedback (Community & Ratings)
-- -----------------------------------------------------------------------------
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_book ON reviews(book_id);

-- -----------------------------------------------------------------------------
-- 8. Seed Sample Data (for Demo & Testing)
-- -----------------------------------------------------------------------------
INSERT INTO categories (name, slug, description) VALUES
('Self-help', 'self-help', 'Personal growth, productivity, and mindset books'),
('Fiction', 'fiction', 'Novels, literary fiction, thrillers, and romance'),
('Non-fiction', 'non-fiction', 'Biographies, essays, business, and factual works'),
('Science Fiction', 'science-fiction', 'Futuristic speculative space and technological tales'),
('Mystery', 'mystery', 'Crime investigation and suspense page-turners'),
('Children''s', 'childrens', 'Illustrated storybooks and middle-grade adventures');

INSERT INTO publishers (name, country, website) VALUES
('ABC Publishers', 'United Kingdom', 'https://abcpublishers.example.com'),
('Horizon Media House', 'India', 'https://horizonbooks.example.com'),
('Starlight Press', 'United States', 'https://starlightpress.example.com');

INSERT INTO authors (name, bio) VALUES
('Arjun Patel', 'Arjun Patel is a renowned behavioral strategist and executive productivity coach.'),
('Raj Patel', 'Raj Patel is a cognitive psychologist exploring deep learning models of human memory.'),
('James Wright', 'James Wright is an entrepreneur and author writing on high-performance habits.'),
('Daniel Reed', 'Daniel Reed is a writer, minimalist, and productivity coach based in San Francisco.'),
('Clara Nelson', 'Clara Nelson writes atmospheric mystery and contemporary gothic fiction.'),
('Emily Parker', 'Emily Parker creates heartwarming animal adventures for readers of all ages.');
