import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';
import api from '../lib/api.js';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SELLER_ID = 'pekka@polyinenhylly.fi';
// Resolve paths relative to this file's directory
const XML_FILE_PATH = path.resolve(__dirname, './data/D4.xml');

const importBooks = async () => {
    try {
        console.log(`Starting import of books from ${XML_FILE_PATH}...`);
        const xmlData = fs.readFileSync(XML_FILE_PATH, 'utf8');

        const parser = new XMLParser({
            ignoreAttributes: false,
            isArray: (name) => ['teos', 'nide'].includes(name),
        });
        const result = parser.parse(xmlData);

        // The root element is 'teokset' and child elements are 'teos'
        const books = result.teokset?.teos || [];
        console.log(`Found ${books.length} books in XML file`);

        for (const book of books) {
            const ttiedot = book.ttiedot;

            const title = ttiedot.nimi;
            const author = ttiedot.tekija;
            const isbn = ttiedot.isbn;

            console.log(`Processing book: ${title} by ${author}`);

            // Create book entry
            const bookData = {
                isbn,
                title,
                author,
                year: null,
                weight: null, // weight is set later if available
                typeid: null,
                genreid: null,
            };

            const bookResult = await api.createBook(bookData);
            if (!bookResult) {
                console.error(`Failed to create book: ${title}`);
                continue;
            }

            const { bookid } = bookResult;
            console.log(`Created book with ID: ${bookid}`);

            // Process all copies of the book
            const copies = book.nide || [];
            console.log(`Found ${copies.length} copies for this book`);

            for (const copy of copies) {
                const price = parseFloat(copy.hinta);

                // Weight is optional in DTD
                let weight = null;
                if (copy.paino) {
                    weight = parseFloat(copy.paino);
                }

                // Set the weight in the book if not already set
                if (!bookData.weight && weight) {
                    bookData.weight = weight;
                }

                // Create copy entry
                const copyData = {
                    bookid,
                    sellerid: SELLER_ID,
                    status: 'available',
                    price,
                    buyinprice: null,
                };

                const copyResult = await api.createCopy(copyData);
                if (!copyResult) {
                    console.error(`Failed to create copy for book: ${title}`);
                    continue;
                }

                console.log(`Created copy with ID: ${copyResult.copyid}`);
            }
        }

        console.log('Import completed!');
    } catch (error) {
        console.error('Error importing books:', error);
    }
};

// Run the import
await importBooks().catch((error) => {
    console.error('Error in importBooks:', error);
});
