import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes will go here
app.get('/', (req, res) => {
    res.send('RXGuardians Backend is running');
});

// Load Data
const dataDir = path.join(__dirname, '../data');
const productsPath = path.join(dataDir, 'products.json');
const ordersPath = path.join(dataDir, 'orders.json');

let products = [];
let orders = [];

try {
    if (fs.existsSync(productsPath)) {
        products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        console.log(`Loaded ${products.length} products`);
    }
    if (fs.existsSync(ordersPath)) {
        orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
        console.log(`Loaded ${orders.length} orders`);
    }
} catch (error) {
    console.error('Error loading data:', error);
}

// Simple API endpoint to fetch products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Simple API endpoint to fetch orders
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
