import { faker } from '@faker-js/faker';
import api from '../lib/api.js';

const createDemoData = async (numItems) => {
    const generatedIsbns = new Set();

    for (let i = 0; i < numItems; i++) {
        // Ensure uniqueness
        let isbn;
        do {
            isbn = faker.commerce.isbn();
        } while (generatedIsbns.has(isbn));

        generatedIsbns.add(isbn);

        const price = faker.commerce.price({ max: 100 });
        const bookData = {
            isbn: isbn,
            sellerid: 1, // rethink this!
            status: 'available',
            price,
            title: faker.book.title(),
            author: faker.book.author(),
            year: faker.date.past().getFullYear(),
            type: faker.book.format(),
            genre: faker.book.genre(),
            mass: faker.number.float({ min: 100, max: 2000 }),
            buyinprice: faker.commerce.price({ max: price }),
            solddate: null,
        };

        await api.createBook(bookData);
    }
};

// Create 10 demo items
createDemoData(process.env.LOAD_AMOUNT || 10);
