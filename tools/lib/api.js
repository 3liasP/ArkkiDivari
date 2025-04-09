class Api {
    constructor() {
        this.baseURL = process.env.BASE_URL || 'http://localhost:8010/api';
    }

    async request(url, options = {}) {
        const response = await fetch(url, options);
        if (response.status === 401)
            console.log('Unauthorized! Do you have server set up in dev mode?');
        return response;
    }

    registerUser = async (user) => {
        try {
            const response = await this.request(
                `${this.baseURL}/user/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                },
            );

            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }

            return await response.json();
        } catch (error) {
            console.error('Error registering user:', error.message);
        }
    };

    createBook = async (book) => {
        try {
            const response = await this.request(`${this.baseURL}/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            });

            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating book:', error.message);
        }
    };

    createCopy = async (copy) => {
        try {
            const response = await this.request(`${this.baseURL}/copy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(copy),
            });

            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating copy:', error.message);
        }
    };
}

const getErrMsg = async (response) => {
    const data = await response.json();
    if (data?.message) return data.message;

    return `HTTP error! status: ${response.status}`;
};

export default new Api();
