
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Array of items
let books = [
    { id: 1, name: 'Book', price: 250 },
    { id: 2, name: 'Pen', price: 25 }
];

let nextId = 3;

// Display homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index6.html'));
});

// READ - Get all items
app.get('/api/books', (req, res) => {
    res.json(books);
});

// CREATE - Add an item
app.post('/api/books', (req, res) => {
    const { name, price } = req.body;

    if (
        typeof name !== 'string' ||
        name.trim() === '' ||
        price === '' ||
        price === null ||
        price === undefined ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0
    ) {
        return res.status(400).json({
            message: 'Enter a valid name and price'
        });
    }

    const book = {
        id: nextId++,
        name: name.trim(),
        price: Number(price)
    };

    books.push(book);
    res.status(201).json(book);
});

// UPDATE - Edit an item
app.put('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(item => item.id === id);

    if (!book) {
        return res.status(404).json({
            message: 'Item not found'
        });
    }

    const { name, price } = req.body;

    if (
        typeof name !== 'string' ||
        name.trim() === '' ||
        price === '' ||
        price === null ||
        price === undefined ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0
    ) {
        return res.status(400).json({
            message: 'Enter a valid name and price'
        });
    }

    book.name = name.trim();
    book.price = Number(price);

    res.json(book);
});

// DELETE - Remove an item
app.delete('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Item not found'
        });
    }

    const deleted = books.splice(index, 1);

    res.json({
        message: 'Item deleted successfully',
        book: deleted[0]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
