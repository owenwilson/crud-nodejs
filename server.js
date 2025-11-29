const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

let pool;
async function createTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        console.log('verifying if table "products" exists...');
        await pool.query(createTableQuery);
        console.log('table "products" exists!');
    } catch (error) {
        console.error('Error creating table "products":', error);
    }
}
async function connectToDbAndSetup() {
    try {
        pool = mysql.createPool(dbConfig);
        await pool.getConnection();
        console.log('Connection successful!');

        await createTable();
        
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
}

app.get('/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        
        res.json({
            count: rows.length,
            products: rows
        });

    } catch (error) {
        console.error('Error get products:', error);
        res.status(500).json({ error: 'Internal error getting products.' });
    }
});

app.get('/', (req, res) => {
    res.send('server nodejs is running CRUD in progress list products in /products.');
});

const PORT = 3000;
connectToDbAndSetup().then(() => {
    app.listen(PORT, () => {
        console.log(`run on http://localhost:${PORT}`);
    });
});

module.exports = { pool };