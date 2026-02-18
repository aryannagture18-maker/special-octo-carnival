import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const productsFile = path.join(__dirname, '../products-export.xlsx');
const ordersFile = path.join(__dirname, '../Consumer Order History 1.xlsx');

const readExcel = (filePath: string) => {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return [];
    }
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (filePath.includes("Consumer")) {
        // The headers are on the 5th row (index 4)
        // range: 4 means start reading from row 4 (0-indexed)
        const rawData = XLSX.utils.sheet_to_json(sheet, { range: 4 });
        return rawData;
    }

    return XLSX.utils.sheet_to_json(sheet);
};

console.log('Converting data...');
const products = readExcel(productsFile);
const orders = readExcel(ordersFile);

console.log(`Processed ${products.length} products`);
console.log(`Processed ${orders.length} orders`);

console.log('--- Order Sample ---');
console.log(JSON.stringify(orders.slice(0, 1), null, 2));

// Save to JSON for easier access
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(products, null, 2));
fs.writeFileSync(path.join(dataDir, 'orders.json'), JSON.stringify(orders, null, 2));

console.log('Data conversion complete. JSON files saved to backend/data/');
