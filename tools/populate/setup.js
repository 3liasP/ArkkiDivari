import { faker } from '@faker-js/faker';
import api from '../lib/api.js';

const createDemoData = async (numItems) => {
    const books = generateBooks(numItems);
    for (const book of books) {
        const result = await api.createBook(book);
        console.log('Created book:', result);
        if (result) {
            const copies = generateCopies(result);
            for (const copy of copies) {
                await api.createCopy(copy);
                console.log('Created copy:', copy);
            }
        }
    }
};

const generateBooks = (numBooks) => {
    const books = [];
    for (let i = 0; i < numBooks; i++) {
        books.push({
            isbn: faker.commerce.isbn(),
            title: faker.book.title(),
            author: faker.book.author(),
            year: faker.date.past({ years: 100 }).getFullYear(),
            weight: faker.number.int({ min: 20, max: 2000 }),
            typeid: faker.number.int({ min: 1, max: 10 }),
            genreid: faker.number.int({ min: 1, max: 10 }),
        });
    }
    return books;
};

const generateCopies = (book) => {
    const numCopies = faker.number.int({ min: 1, max: 10 });
    const copies = [];
    for (let i = 0; i < numCopies; i++) {
        const price = faker.commerce.price({ max: 100 });
        const status = faker.helpers.arrayElement([
            'available',
            'sold',
            'reserved',
        ]);
        copies.push({
            bookid: book.bookid,
            sellerid: faker.helpers.arrayElement([
                'lasse@lassenlehti.fi',
                'galle@galeinngalle.fi',
            ]),
            status,
            price,
            buyinprice: faker.commerce.price({ max: price }),
            solddate: status === 'sold' ? faker.date.past() : null,
        });
    }
    return copies;
};

// Create 10 demo items
createDemoData(process.env.LOAD_AMOUNT || 10);
