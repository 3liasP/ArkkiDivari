import { faker } from '@faker-js/faker';
import api from '../lib/api.js';

const createDemoData = async (numItems) => {
    console.log('Creating demo data...');
    const users = generateUsers();
    for (const user of users) {
        const registered = await api.registerUser(user);
        if (registered)
            console.log('Registered user:', {
                ...registered,
                password: user.password,
            });
    }
    // not working as of now...
    // we need to simulate login and then add books & copies
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

const generateUsers = (numUsers = 10) => {
    const users = [
        {
            userid: 'admin@arkkidivari.com',
            role: 'admin',
            password: 'admin123',
            name: 'Järjestelmänvalvoja',
            address: 'Koulukatu 1',
            zip: '33100',
            city: 'Tampere',
            phone: '0451098765',
        },
        {
            userid: 'lasse@lassenlehti.fi',
            role: 'seller',
            password: 'lasse456',
            name: 'Lasse Lehtinen',
            address: 'Satamakatu 14',
            zip: '33200',
            city: 'Tampere',
            phone: '0401234567',
        },

        {
            userid: 'galle@galeinngalle.fi',
            role: 'seller',
            password: 'galle789',
            name: 'Galle Galleinn',
            address: 'Pasilanraitio 11',
            zip: '00240',
            city: 'Helsinki',
            phone: '0507654321',
        },
    ];

    for (let i = 0; i < numUsers; i++) {
        users.push({
            userid: faker.internet.email(),
            password: faker.internet.password(),
            name: faker.person.fullName(),
            address: faker.location.streetAddress(),
            zip: faker.location.zipCode(),
            city: faker.location.city(),
            phone: faker.phone.number({ style: 'international' }),
        });
    }
    return users;
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
