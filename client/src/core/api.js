import { logout } from '../components/user/user.actions';
import store from './store';

class Api {
    constructor() {
        this.baseURL = '/api';
    }

    async request(url, options = {}) {
        const response = await fetch(url, options);
        if (response.status === 401) store.dispatch(logout());
        return response;
    }

    async me() {
        const response = await this.request(`${this.baseURL}/user/me`, {
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
    }

    async login(userid, password) {
        try {
            const response = await this.request(`${this.baseURL}/user/login`, {
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
            const response = await this.request(
                `${this.baseURL}/user/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userInfo),
                },
            );
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
            const response = await this.request(`${this.baseURL}/user/logout`, {
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

    async updateUser(userInfo) {
        try {
            const response = await this.request(`${this.baseURL}/user/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo),
            });
            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async search(params) {
        try {
            const response = await this.request(`${this.baseURL}/search`, {
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
            const response = await this.request(`${this.baseURL}/book/${id}`, {
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
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating book:', error);
            throw error;
        }
    }

    async createCopy(copy) {
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
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating copy:', error);
            throw error;
        }
    }

    async updateBook(book) {
        try {
            const response = await this.request(
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
            const response = await this.request(`${this.baseURL}/book/${id}`, {
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
            const response = await this.request(`${this.baseURL}/schema`, {
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

    async createOrder(copyids) {
        try {
            const response = await this.request(
                `${this.baseURL}/order/create`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ copyids }),
                },
            );
            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    async cancelOrder(orderid) {
        try {
            const response = await this.request(
                `${this.baseURL}/order/cancel`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ orderid }),
                },
            );
            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error canceling order:', error);
            throw error;
        }
    }

    async completeOrder(orderid) {
        try {
            const response = await this.request(
                `${this.baseURL}/order/complete`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ orderid }),
                },
            );
            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error completing order:', error);
            throw error;
        }
    }
    async getOrderHistory() {
        try {
            const response = await this.request(`${this.baseURL}/order/`, {
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
            console.error('Error fetching orders:', error);
            throw error;
        }
    }
    async downloadReport(reportId) {
        try {
            const response = await this.request(
                `${this.baseURL}/report/${reportId}`,
                {
                    method: 'GET',
                },
            );

            if (!response.ok) {
                const errMsg = await getErrMsg(response);
                throw new Error(errMsg);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${reportId}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error(`Error downloading report ${reportId}:`, error);
            throw error;
        }
    }
}

const getErrMsg = async (response) => {
    try {
        const data = await response.json();
        if (data?.message) return data.message;
    } catch (error) {
        console.error('Error getting error message:', error);
        return `HTTP virhe! status: ${response.status}`;
    }
};

const api = new Api();

export default api;
