class Api {
    constructor() {
        this.baseURL = '/api';
    }

    async login(userid, password) {
        try {
            const response = await fetch(`${this.baseURL}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid, password }),
            });
            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }

    async register(userInfo) {
        try {
            const response = await fetch(`${this.baseURL}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo),
            });
            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }
        } catch (error) {
            console.error('Error registering:', error);
            throw error;
        }
    }

    async logout() {
        try {
            const response = await fetch(`${this.baseURL}/user/logout`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    }

    async search(params) {
        try {
            const response = await fetch(`${this.baseURL}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching books:', error);
            throw error;
        }
    }

    async getBookById(id) {
        try {
            const response = await fetch(`${this.baseURL}/book/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching book by ID:', error);
            throw error;
        }
    }

    async createBook(book) {
        try {
            const response = await fetch(`${this.baseURL}/book`, {
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
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating book:', error);
            throw error;
        }
    }

    async updateBook(book) {
        try {
            const response = await fetch(
                `${this.baseURL}/book/${book.bookid}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(book),
                },
            );
            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating book:', error);
            throw error;
        }
    }

    async deleteBook(id) {
        try {
            const response = await fetch(`${this.baseURL}/book/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting book:', error);
            throw error;
        }
    }

    async getSchema() {
        try {
            const response = await fetch(`${this.baseURL}/schema`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching book schema:', error);
            throw error;
        }
    }
}

const getErrMsg = async (response) => {
    const data = await response.json();
    if (data?.message) return data.message;

    return `HTTP virhe! status: ${response.status}`;
};

const api = new Api();

export default api;
