-- Enable the UUID extension for globally unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Initialize the Central Database
CREATE SCHEMA central;

-- Create enumns
CREATE TYPE bookStatus AS ENUM('available', 'reserved', 'sold');

CREATE TYPE userRole AS ENUM('admin', 'seller', 'customer');

CREATE TYPE orderStatus AS ENUM('pending', 'completed', 'cancelled');

CREATE TABLE central.Sellers (
    sellerId TEXT PRIMARY KEY, -- business ID, "y-tunnus"
    schemaName TEXT NOT NULL,
    independent BOOLEAN NOT NULL DEFAULT FALSE,
    name TEXT NOT NULL,
    address TEXT,
    zip TEXT,
    city TEXT,
    phone TEXT,
    email TEXT,
    website TEXT
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

CREATE TABLE central.Types (typeId SERIAL PRIMARY KEY, name TEXT NOT NULL);

CREATE TABLE central.Genres (genreId SERIAL PRIMARY KEY, name TEXT NOT NULL);

CREATE TABLE central.Books (
    bookId UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    isbn TEXT UNIQUE, -- can be null
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INT,
    weight NUMERIC,
    typeId INT REFERENCES central.Types (typeId),
    genreId INT REFERENCES central.Genres (genreId),
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE central.Copies (
    copyId UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    bookId UUID NOT NULL REFERENCES central.Books (bookId),
    sellerId TEXT REFERENCES central.Sellers (sellerId),
    status bookStatus NOT NULL DEFAULT 'available',
    price NUMERIC,
    buyInPrice NUMERIC,
    soldDate TIMESTAMPTZ,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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

CREATE TABLE central.ShippingCosts (weight NUMERIC PRIMARY KEY, cost NUMERIC NOT NULL);

-- Example of creating a seller schema and its tables
CREATE SCHEMA D1;

CREATE TABLE D1.Books (
    bookId UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    isbn TEXT UNIQUE, -- can be null
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INT,
    weight NUMERIC,
    typeId INT REFERENCES central.Types (typeId),
    genreId INT REFERENCES central.Genres (genreId)
);

CREATE TABLE D1.Copies (
    copyId UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    bookId UUID NOT NULL REFERENCES D1.Books (bookId),
    sellerId TEXT NOT NULL DEFAULT 'lasse@lassenlehti.fi',
    status bookStatus NOT NULL DEFAULT 'available',
    price NUMERIC,
    buyInPrice NUMERIC,
    soldDate TIMESTAMPTZ
);

-- Schema for seller D3
CREATE SCHEMA D3;

CREATE TABLE D3.Books (
    bookId UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    isbn TEXT UNIQUE, -- can be null
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INT,
    weight NUMERIC,
    typeId INT REFERENCES central.Types (typeId),
    genreId INT REFERENCES central.Genres (genreId)
);

CREATE TABLE D3.Copies (
    copyId UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    bookId UUID NOT NULL REFERENCES D3.Books (bookId),
    sellerId TEXT NOT NULL DEFAULT 'kimmo@kirjakammio.fi',
    status bookStatus NOT NULL DEFAULT 'available',
    price NUMERIC,
    buyInPrice NUMERIC,
    soldDate TIMESTAMPTZ
);

INSERT INTO
    central.Sellers (sellerId, schemaName, independent, name, address, zip, city, phone, website)
VALUES
    (
        'lasse@lassenlehti.fi',
        'D1',
        TRUE,
        'Lassen Lehti',
        'Satamakatu 14',
        '33200',
        'Tampere',
        '0401234567',
        'https://lassenlehti.fi'
    ),
    (
        'galle@galeinngalle.fi',
        'central',
        FALSE,
        'Galeinn Galle',
        'Pasilanraitio 11',
        '00240',
        'Helsinki',
        '0507654321',
        'https://galeinngalle.fi'
    ),
    (
        'kimmo@kirjakammio.fi',
        'D3',
        TRUE,
        'Kirjakammio',
        'Mannerheimintie 10',
        '00100',
        'Helsinki',
        '094321',
        'https://kirjakammio.fi'
    ),
    (
        'pekka@polyinenhylly.fi',
        'D4',
        FALSE,
        'Pölyinen Hylly',
        'Kauppakatu 5',
        '33100',
        'Tampere',
        '0409876543',
        'https://polyinenhylly.fi'
    );

INSERT INTO
    central.Types (name)
VALUES
    ('Romaani'),
    ('Sarjakuva'),
    ('Tietokirja'),
    ('Novellikokoelma'),
    ('Lastenkirja'),
    ('Runokokoelma'),
    ('Oppikirja'),
    ('Elämäkerta'),
    ('Keittokirja'),
    ('Matkaopas');

INSERT INTO
    central.Genres (name)
VALUES
    ('Fantasia'),
    ('Scifi'),
    ('Dekkari'),
    ('Kauhu'),
    ('Romantiikka'),
    ('Historia'),
    ('Seikkailu'),
    ('Trilleri'),
    ('Draama'),
    ('Huumori'),
    ('Opas');

INSERT INTO
    central.ShippingCosts (weight, cost)
VALUES
    (50, 2.50),
    (250, 5.00),
    (1000, 10.00),
    (2000, 15.00);

-- functions
-- trigger functions
CREATE OR REPLACE FUNCTION update_updated_at () RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = CURRENT_TIMESTAMP;
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_updated_at BEFORE
UPDATE ON central.Books FOR EACH ROW
EXECUTE FUNCTION update_updated_at ();

CREATE TRIGGER update_updated_at BEFORE
UPDATE ON central.Copies FOR EACH ROW
EXECUTE FUNCTION update_updated_at ();

CREATE OR REPLACE FUNCTION sync_d3_books () RETURNS TRIGGER AS $$
BEGIN
    PERFORM 1 FROM central.Books
    WHERE isbn = NEW.isbn AND title = NEW.title AND author = NEW.author;
    
    IF NOT FOUND THEN
        INSERT INTO central.Books (isbn, title, author, year, weight, typeId, genreId)
        VALUES (NEW.isbn, NEW.title, NEW.author, NEW.year, NEW.weight, NEW.typeId, NEW.genreId);
        SELECT bookId INTO NEW.bookId
        FROM central.Books
        WHERE isbn = NEW.isbn AND title = NEW.title AND author = NEW.author;
    ELSE
        SELECT bookId INTO NEW.bookId
        FROM central.Books
        WHERE isbn = NEW.isbn AND title = NEW.title AND author = NEW.author;
    END IF;

    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_d3_books AFTER
INSERT OR UPDATE ON D3.Books FOR EACH ROW
EXECUTE FUNCTION sync_d3_books ();

CREATE OR REPLACE FUNCTION sync_d3_copies () RETURNS TRIGGER AS $$
DECLARE
    central_bookId UUID;
BEGIN
    -- Fetch the corresponding bookId from central.Books
    SELECT bookId INTO central_bookId
    FROM central.Books
    WHERE isbn = (SELECT isbn FROM D3.Books WHERE bookId = NEW.bookId);

    -- Ensure the bookId exists in central.Books
    IF central_bookId IS NULL THEN
        RAISE EXCEPTION 'Book ID % does not exist in central.Books', NEW.bookId;
    END IF;

    INSERT INTO central.Copies (bookId, sellerId, status, price, buyInPrice)
    VALUES (central_bookId, NEW.sellerId, NEW.status, NEW.price, NEW.buyInPrice);
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_d3_copies AFTER
INSERT OR UPDATE ON D3.Copies FOR EACH ROW
EXECUTE FUNCTION sync_d3_copies ();

-- shop functions
CREATE OR REPLACE FUNCTION calculate_subtotal (copyids UUID[]) RETURNS NUMERIC AS $$
DECLARE
	copy_price NUMERIC := 0;
    subtotal NUMERIC := 0;
BEGIN
    -- Iterate over the array of copy IDs
    FOR i IN 1 .. array_length(copyids, 1) LOOP
        -- Get the price of the copy and add it to the subtotal
        SELECT price INTO copy_price
        FROM central.Copies
        WHERE copyId = copyids[i];
		RAISE NOTICE 'copyid: %',copyids[i];
		
        subtotal := subtotal + copy_price;
    END LOOP;

    RETURN subtotal;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_shipping_cost (copyids UUID[]) RETURNS NUMERIC AS $$
DECLARE
    total_weight NUMERIC := 0;
    book_weight NUMERIC;
    shipping_cost NUMERIC := 0;
    max_weight NUMERIC;
    parcel_weight NUMERIC := 0;
    parcel_cost NUMERIC;
BEGIN
    -- Get the maximum weight limit from the ShippingCosts table
    SELECT MAX(weight) INTO max_weight FROM central.ShippingCosts;

    -- Calculate the total weight of the books
    FOR i IN 1 .. array_length(copyids, 1) LOOP
        SELECT b.weight INTO book_weight
        FROM central.Copies c
        JOIN central.Books b ON c.bookId = b.bookId
        WHERE c.copyId = copyids[i];

        total_weight := total_weight + book_weight;
    END LOOP;

    -- Calculate the shipping cost for each parcel
    WHILE total_weight > 0 LOOP
        IF total_weight > max_weight THEN
            parcel_weight := max_weight;
        ELSE
            parcel_weight := total_weight;
        END IF;

        -- Determine the shipping cost for the current parcel
        SELECT cost INTO parcel_cost
        FROM central.ShippingCosts
        WHERE weight >= parcel_weight
        ORDER BY weight
        LIMIT 1;

        shipping_cost := shipping_cost + parcel_cost;
        total_weight := total_weight - parcel_weight;
    END LOOP;

    RETURN shipping_cost;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_order (copyids UUID[], userid TEXT) RETURNS INT AS $$
DECLARE
    _orderid INT;
    subtotal NUMERIC;
    shipping_cost NUMERIC;
    total NUMERIC;
BEGIN
    -- Check if copies are available
    IF NOT EXISTS (
        SELECT 1
        FROM central.Copies
        WHERE copyId = ANY(copyids) AND status = 'available'
    ) THEN
        RAISE EXCEPTION 'One or more copies are not available';
    END IF;
	
    -- Reserve the copies for the order
    UPDATE central.Copies
    SET status = 'reserved'
    WHERE copyId = ANY(copyids);

    -- Calculate the subtotal of the order
    subtotal := calculate_subtotal(copyids);

    -- Calculate the shipping cost of the order
    shipping_cost := calculate_shipping_cost(copyids);

    -- Calculate the total cost of the order
    total := subtotal + shipping_cost;

    -- Insert the order into the Orders table
    INSERT INTO central.Orders (userId, status, subtotal, shipping, total)
    VALUES (userid, 'pending', subtotal, shipping_cost, total)
    RETURNING orderId INTO _orderid;

    -- Insert the order items into the OrderItems table
    FOR i IN 1 .. array_length(copyids, 1) LOOP
        INSERT INTO central.OrderItems (orderid, copyId)
        VALUES (_orderid, copyids[i]);
    END LOOP;

    RETURN _orderid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cancel_order (_orderid INT, _userid TEXT) RETURNS VOID AS $$
BEGIN
    -- Check if the order belongs to the user
    IF NOT EXISTS (
        SELECT 1
        FROM central.Orders
        WHERE orderId = _orderid AND userId = _userid
    ) THEN
        RAISE EXCEPTION 'Order does not belong to the user';
    END IF;

    -- Check if the order is already completed, then do nothing
    IF EXISTS (
        SELECT 1
        FROM central.Orders
        WHERE orderId = _orderid AND status = 'completed'
    ) THEN
        RETURN;
    END IF;

    -- Update the status of the copies in the order to 'available'
    UPDATE central.Copies
    SET status = 'available'
    WHERE copyId IN (
        SELECT copyId
        FROM central.OrderItems
        WHERE orderId = _orderid
    );
    -- Update the status of the order to 'cancelled'
    UPDATE central.Orders
    SET status = 'cancelled'
    WHERE orderId = _orderid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION complete_order (_orderid INT, _userid TEXT) RETURNS VOID AS $$
BEGIN
    -- Check if the order belongs to the user
    IF NOT EXISTS (
        SELECT 1
        FROM central.Orders
        WHERE orderId = _orderid AND userId = _userid
    ) THEN
        RAISE EXCEPTION 'Order does not belong to the user';
    END IF;
    -- Update the status of the copies in the order to 'sold'
    UPDATE central.Copies
    SET status = 'sold', soldDate = CURRENT_TIMESTAMP
    WHERE copyId IN (
        SELECT copyId
        FROM central.OrderItems
        WHERE orderId = _orderid
    );

    -- Update the status of the order to 'completed'
    UPDATE central.Orders
    SET status = 'completed'
    WHERE orderId = _orderid;   
END;
$$ LANGUAGE plpgsql;

-- views
-- report R2
CREATE OR REPLACE VIEW central.GenreSalesSummary AS
SELECT
    g.name AS genre,
    SUM(c.price) AS total_sales_price,
    AVG(c.price) AS average_price
FROM
    central.Copies c
    JOIN central.Books b ON c.bookId = b.bookId
    JOIN central.Genres g ON b.genreId = g.genreId
WHERE
    c.status = 'available'
GROUP BY
    g.name;

-- report R3
CREATE OR REPLACE VIEW central.CustomerPurchasesLastYear AS
SELECT
    u.userId,
    u.name,
    COUNT(oi.copyId) AS copies_purchased
FROM
    central.Users u
    JOIN central.Orders o ON u.userId = o.userId
    JOIN central.OrderItems oi ON o.orderId = oi.orderId
WHERE
    o.status = 'completed'
    AND o.time >= (CURRENT_DATE - INTERVAL '1 year')
GROUP BY
    u.userId, u.name;

-- tsvector, experimental
ALTER TABLE central.Books
ADD COLUMN tsv tsvector;

CREATE INDEX books_tsv_idx ON central.Books USING gin (tsv);

CREATE OR REPLACE FUNCTION update_tsv () RETURNS trigger AS $$
BEGIN
  NEW.tsv :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.author, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.isbn, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate BEFORE INSERT
OR
UPDATE ON central.Books FOR EACH ROW
EXECUTE FUNCTION update_tsv ();