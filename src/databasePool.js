import sql from 'mssql';

const config = {
    server: process.env.DATABASE_SERVER,
    port: parseInt(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

const pool = new sql.ConnectionPool(config);

// Create connection to check it is connected
pool.connect().then(() => {
    console.log('Connected to database');
}).catch(err => {
    console.log('Connection failed', err);
});

process.on('SIGINT', () => {
    if (pool.connected)
    pool.close(() => console.log('Database pool closed due to application termination'));
});

export default pool;
