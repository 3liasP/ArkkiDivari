class Api {
    constructor() {
        this.baseURL = process.env.BASE_URL || 'http://localhost:8010/api';
    }

    createBook = async (book) => {
        try {
            const response = await fetch(`${this.baseURL}/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating book:', error.message);
        }
    };

    createCopy = async (copy) => {
        try {
            const response = await fetch(`${this.baseURL}/copy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(copy),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating copy:', error.message);
        }
    };
}

export default new Api();
