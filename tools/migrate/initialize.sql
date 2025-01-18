-- Enable the UUID extension for globally unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Initialize the Central Database
CREATE SCHEMA central;

-- Create enumns
CREATE TYPE bookStatus AS ENUM('available', 'reserved', 'sold');

CREATE TYPE userRole AS ENUM('admin', 'seller', 'customer');

CREATE TYPE orderStatus AS ENUM('pending', 'completed');

-- Central Database Tables
CREATE TABLE central.Sellers (
    sellerId SERIAL PRIMARY KEY,
    schemaName TEXT NOT NULL,
    independent BOOLEAN NOT NULL DEFAULT FALSE,
    name TEXT NOT NULL,
    address TEXT,
    zip TEXT,
    city TEXT,
    email TEXT UNIQUE,
    phone TEXT
);

CREATE TABLE central.Books (
    bookId UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    isbn TEXT,
    sellerId INT REFERENCES central.Sellers (sellerId),
    status bookStatus NOT NULL DEFAULT 'available',
    price NUMERIC,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INT,
    type TEXT,
    genre TEXT,
    mass NUMERIC,
    buyInPrice NUMERIC,
    soldDate TIMESTAMPTZ
);

CREATE TABLE central.Users (
    userId SERIAL PRIMARY KEY,
    role userRole NOT NULL,
    sellerId INT REFERENCES central.Sellers (sellerId),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Must be hashed
    name TEXT NOT NULL,
    address TEXT,
    zip TEXT,
    city TEXT,
    email TEXT UNIQUE,
    phone TEXT
);

CREATE TABLE central.Orders (
    orderId SERIAL PRIMARY KEY,
    userId INT NOT NULL REFERENCES central.Users (userId),
    time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status orderStatus NOT NULL,
    subtotal NUMERIC,
    shipping NUMERIC,
    total NUMERIC
);

CREATE TABLE central.OrderItems (
    orderId INT NOT NULL REFERENCES central.Orders (orderId),
    bookId UUID NOT NULL REFERENCES central.Books (bookId),
    PRIMARY KEY (orderId, bookId)
);

-- Example of creating a seller schema and its tables
CREATE SCHEMA D1;

CREATE TABLE D1.Books (
    bookId UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    isbn TEXT,
    sellerId INT REFERENCES central.Sellers (sellerId),
    status bookStatus NOT NULL DEFAULT 'available',
    price NUMERIC,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INT,
    type TEXT,
    genre TEXT,
    mass NUMERIC,
    buyInPrice NUMERIC,
    soldDate TIMESTAMPTZ
);

-- Synchronization logic here.
-- Functions
-- Insert demo data for testing
INSERT INTO
    central.Sellers (schemaName, independent, name, address, zip, city, email, phone)
VALUES
    (
        'D1',
        TRUE,
        'Lassen Lehti',
        'Satamakatu 14',
        '33200',
        'Tampere',
        'lasse@lassenlehti.fi',
        '0401234567'
    ),
    (
        'central',
        FALSE,
        'Galeinn Galle',
        'Pasilanraitio 11',
        '00240',
        'Helsinki',
        'galle@galeinngalle.fi',
        '0507654321'
    );
