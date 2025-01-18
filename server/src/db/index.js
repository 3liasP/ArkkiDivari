import pg from 'pg';

class Database {
    constructor() {
        this.pool = null;
    }

    connect = () => {
        try {
            const config = {
                // client
                user: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || 'mysecretpassword',
                host: process.env.DB_HOST || 'localhost',
                database: process.env.DB_NAME || 'data',
                port: process.env.DB_PORT || '5432',
                statement_timeout: process.env.DB_STATEMENT_TIMEOUT || 0,
                query_timeout: process.env.DB_QUERY_TIMEOUT || 0,
                application_name: 'antiquarian',
                idle_in_transaction_session_timeout:
                    process.env.DB_TRANSACTION_IDLE_TIMEOUT || 30000,
                // pool
                connectionTimeoutMillis: 10000,
                idleTimeoutMillis: 10000,
                max: 10,
                allowExitOnIdle: false,
            };
            this.pool = new pg.Pool(config);
        } catch (error) {
            console.log('DB connection error', error);
            process.exit(1);
        }
    };

    query = async (sql, values) => {
        try {
            if (process.env.DB_DEBUG)
                console.log('SQL: ' + sql, '\nARGS:', values);
            return await this.pool.query(sql, values);
        } catch (error) {
            if (process.env.DB_DEBUG)
                console.log(
                    'SQL ERROR: \n  SQL:' +
                        sql +
                        '\n  VALUES:' +
                        values +
                        '\n  ERROR:' +
                        error,
                );
            throw error;
        }
    };

    transact = async () => {
        const client = await this.pool.connect();

        if (process.env.DB_DEBUG) console.log('SQL TRANSACTION BEGIN');
        await client.query('BEGIN');

        return {
            query: async (sql, values) => {
                if (process.env.DB_DEBUG)
                    console.log('SQL TRANSACTION: ' + sql, '\nARGS:', values);
                return await client.query(sql, values);
            },
            rollback: async () => {
                if (process.env.DB_DEBUG)
                    console.log('SQL TRANSACTION ROLLBACK');
                await client.query('ROLLBACK');
                client.release(true);
            },
            commit: async () => {
                if (process.env.DB_DEBUG) console.log('SQL TRANSACTION COMMIT');
                await client.query('COMMIT');
                client.release();
            },
        };
    };

    close = async () => {
        await this.pool.end();
    };
}

const db = new Database();

export default db;
