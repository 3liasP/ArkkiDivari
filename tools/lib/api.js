class Api {
    constructor() {
        this.baseURL = process.env.BASE_URL || 'http://localhost:8081/api';
    }

    createBook = async (bookData) => {
        try {
            const response = await fetch(`${this.baseURL}/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            console.log(`Book created with ISBN: ${data.isbn}`);
        } catch (error) {
            console.error('Error creating book:', error.message);
        }
    };
}

export default new Api();
