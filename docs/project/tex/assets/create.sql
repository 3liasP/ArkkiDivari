-- Enable the UUID extension for globally unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Initialize the Central Database
CREATE SCHEMA central;

-- Create enumns
CREATE TYPE bookStatus AS ENUM('available', 'reserved', 'sold');

CREATE TYPE userRole AS ENUM('admin', 'seller', 'customer');

CREATE TYPE orderStatus AS ENUM('pending', 'completed');

CREATE TABLE central.Sellers (
    sellerId TEXT PRIMARY KEY, -- business ID, "y-tunnus"
    schemaName TEXT NOT NULL,
    independent BOOLEAN NOT NULL DEFAULT FALSE,
    name TEXT NOT NULL,
    address TEXT,
    zip TEXT,
    city TEXT,
    phone TEXT,
    email TEXT
);

-- Central Database Tables
CREATE TABLE central.Users (
    userId TEXT PRIMARY KEY, -- Email
    sellerId TEXT REFERENCES central.Sellers (sellerId),
    role userRole NOT NULL,
    password TEXT NOT NULL, -- Must be hashed
    name TEXT NOT NULL,
    address TEXT,
    zip TEXT,
    city TEXT,
    phone TEXT
);

CREATE TABLE central.Types (
    typeId SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE central.Genres (
    genreId SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE central.Books (
    bookId UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    isbn TEXT UNIQUE, -- can be null
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INT,
    typeId INT REFERENCES central.Types (typeId),
    genreId INT REFERENCES central.Genres (genreId)
);

CREATE TABLE central.Copies (
    copyId UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    bookId UUID NOT NULL REFERENCES central.Books (bookId),
    sellerId TEXT REFERENCES central.Sellers (sellerId),
    status bookStatus NOT NULL DEFAULT 'available',
    price NUMERIC,
    weight NUMERIC,
    buyInPrice NUMERIC,
    soldDate TIMESTAMPTZ
);

CREATE TABLE central.Orders (
    orderId SERIAL PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES central.Users (userId),
    time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status orderStatus NOT NULL,
    subtotal NUMERIC,
    shipping NUMERIC,
    total NUMERIC
);

CREATE TABLE central.OrderItems (
    orderId INT NOT NULL REFERENCES central.Orders (orderId),
    copyId UUID NOT NULL REFERENCES central.Copies (copyId),
    PRIMARY KEY (orderId, copyId)
);

-- Example of creating a seller schema and its tables
CREATE SCHEMA D1;

CREATE TABLE D1.Books (
    isbn TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INT,
    type TEXT,
    genre TEXT
);

CREATE TABLE D1.Copies (
    copyId UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    isbn TEXT NOT NULL REFERENCES D1.Books (isbn),
    sellerId TEXT NOT NULL DEFAULT 'lasse@lassenlehti.fi',
    status bookStatus NOT NULL DEFAULT 'available',
    price NUMERIC,
    weight NUMERIC,
    buyInPrice NUMERIC,
    soldDate TIMESTAMPTZ
);
