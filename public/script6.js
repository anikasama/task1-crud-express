
const form = document.getElementById('bookForm');
const bookId = document.getElementById('bookId');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const table = document.getElementById('bookTable');
const message = document.getElementById('message');

async function loadBooks() {
    try {
        const response = await fetch('/api/books');

        if (!response.ok) {
            throw new Error('Could not load items');
        }

        const books = await response.json();
        table.replaceChildren();

        books.forEach(book => {
            const row = document.createElement('tr');

            [book.id, book.name, '₹' + book.price].forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actions = document.createElement('td');

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit';
            editBtn.addEventListener('click', () => editBook(book));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete';
            deleteBtn.addEventListener('click', () => deleteBook(book.id));

            actions.append(editBtn, deleteBtn);
            row.appendChild(actions);
            table.appendChild(row);
        });
    } catch (error) {
        showMessage(error.message, true);
    }
}

form.addEventListener('submit', async event => {
    event.preventDefault();

    const id = bookId.value;
    const data = {
        name: nameInput.value.trim(),
        price: priceInput.value
    };

    try {
        const response = await fetch(
            id ? `/api/books/${id}` : '/api/books',
            {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Request failed');
        }

        showMessage(id ? 'Item updated successfully!' :
                           'Item added successfully!');

        resetForm();
        await loadBooks();
    } catch (error) {
        showMessage(error.message, true);
    }
});

function editBook(book) {
    bookId.value = book.id;
    nameInput.value = book.name;
    priceInput.value = book.price;
    submitBtn.textContent = 'Update Item';
    cancelBtn.hidden = false;
    nameInput.focus();
}

async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    try {
        const response = await fetch(`/api/books/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Delete failed');
        }

        showMessage('Item deleted successfully!');
        await loadBooks();
    } catch (error) {
        showMessage(error.message, true);
    }
}

function resetForm() {
    form.reset();
    bookId.value = '';
    submitBtn.textContent = 'Add Item';
    cancelBtn.hidden = true;
}

function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? '#dc2626' : '#15803d';
}

cancelBtn.addEventListener('click', resetForm);

loadBooks();
