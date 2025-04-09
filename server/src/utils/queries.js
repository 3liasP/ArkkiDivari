import db from '../db/database.js';

export const getUserSchema = async (userid) => {
    const result = await db.query('SELECT get_user_schema($1) AS schema_name', [
        userid,
    ]);
    if (result.rows.length) {
        return result.rows[0].schema_name;
    } else {
        throw new Error("Couldn't get user schema");
    }
};

export const insertBook = async (schemaName, book) => {
    const params = [
        book.isbn,
        book.title,
        book.author,
        book.year,
        book.weight,
        book.typeid,
        book.genreid,
    ];
    if (book.bookid) params.push(book.bookid);
    return await db.query(
        `INSERT INTO ${schemaName}.Books (
            isbn, title, author, year, weight, typeid, genreid${book.bookid ? ', bookid' : ''}
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7${book.bookid ? ', $8' : ''}
        ) RETURNING *`,
        params,
    );
};

export const updateBook = async (schemaName, book) => {
    return await db.query(
        `UPDATE ${schemaName}.Books SET
            isbn = $1,
            title = $2,
            author = $3,
            year = $4,
            weight = $5,
            typeid = $6,
            genreid = $7
        WHERE bookid = $8 RETURNING *`,
        [
            book.isbn,
            book.title,
            book.author,
            book.year,
            book.weight,
            book.typeid,
            book.genreid,
            book.bookid,
        ],
    );
};

export const deleteBook = async (schemaName, bookId) => {
    return await db.query(
        `DELETE FROM ${schemaName}.Books WHERE bookid = $1 RETURNING *`,
        [bookId],
    );
};

export const syncBook = async (bookid, schemaName) => {
    const result = await db.query(
        `SELECT * FROM ${schemaName}.Books WHERE bookid = $1`,
        [bookid],
    );
    if (!result.rows.length) {
        const result = await db.query(
            `SELECT * FROM central.Books WHERE bookid = $1`,
            [bookid],
        );
        if (!result.rows.length) {
            throw new Error('Book not found');
        }
        await insertBook(schemaName, result.rows[0]);
    }
};

export const insertCopy = async (schemaName, copy) => {
    const params = [
        copy.bookid,
        copy.sellerid,
        copy.status,
        copy.price,
        copy.buyinprice,
    ];
    if (copy.copyid) params.push(copy.copyid);
    return await db.query(
        `INSERT INTO ${schemaName}.Copies (
            bookid, sellerid, status, price, buyinprice${copy.copyid ? ', copyid' : ''}
        ) VALUES (
            $1, $2, $3, $4, $5${copy.copyid ? ', $6' : ''}
        ) RETURNING *`,
        params,
    );
};

export const updateCopy = async (schemaName, copy) => {
    return await db.query(
        `UPDATE ${schemaName}.Copies SET
            bookid = $1,
            sellerid = $2,
            status = $3,
            price = $4,
            buyinprice = $5
        WHERE copyid = $6 
        RETURNING *`,
        [
            copy.bookid,
            copy.sellerid,
            copy.status,
            copy.price,
            copy.buyinprice,
            copy.copyid,
        ],
    );
};

export const deleteCopy = async (schemaName, copyId) => {
    return await db.query(
        `DELETE FROM ${schemaName}.Copies WHERE copyid = $1 RETURNING *`,
        [copyId],
    );
};
