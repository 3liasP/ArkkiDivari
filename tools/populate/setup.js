import { faker } from '@faker-js/faker';
import api from '../lib/api.js';
import { DEFAULTS } from './defaults.js';

const createDemoData = async (numUsers, numBooks) => {
    console.log('Creating demo data...');
    const users = generateUsers(numUsers);
    for (const user of users) {
        const registered = await api.registerUser(user);
        if (registered)
            console.log('Registered user:', {
                ...registered,
                password: user.password,
            });
    }
    const books = generateBooks(numBooks);
    for (const book of books) {
        const result = await api.createBook(book);
        if (result) {
            console.log('Created book:', result);
            const copies = generateCopies(result);
            for (const copy of copies) {
                const result = await api.createCopy(copy);
                if (result) console.log('Created copy:', result);
            }
        }
    }
};

const generateUsers = (numUsers = 10) => {
    const users = [...DEFAULTS.users];
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
    const books = [...DEFAULTS.books];
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
        const status = faker.helpers.arrayElement(['available', 'sold']);
        copies.push({
            bookid: book.bookid,
            sellerid: faker.helpers.arrayElement([
                'lasse@lassenlehti.fi',
                'galle@galeinngalle.fi',
                'kimmo@kirjakammio.fi',
            ]),
            status,
            price,
            buyinprice: faker.commerce.price({ max: price }),
            solddate: status === 'sold' ? faker.date.past() : null,
        });
    }
    return copies;
};

const main = async () => {
    if (!process.argv[2] || !process.argv[3]) {
        console.error('Usage: node setup.js <numUsers> <numBooks>');
        process.exit(1);
    }
    console.log('Running setups...');

    const numUsers = process.argv[2] || 10;
    const numBooks = process.argv[3] || 10;
    await createDemoData(numUsers, numBooks);
};

main();
