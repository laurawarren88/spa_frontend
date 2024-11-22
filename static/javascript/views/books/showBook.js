import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Book Details");
        // console.log('Params received:', params);
        this.bookId = params.id;
    }

    async getHtml() {
        try {
            // console.log('Fetching book with ID:', this.bookId);

            if (!this.bookId) {
                throw new Error('Book ID is required');
            }

            const response = await fetch(`http://localhost:8080/api/books/${this.bookId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch book');
            }

            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
            const isAdmin = payload?.isAdmin || false;
    
            const book = await response.json();
    
            return `
                <div id="booksContainer">
                    <h2>${book.title}</h2>
                    <p>${book.author}</p>
                    <p>${book.category}</p>
                    <p>${book.description}</p>
                </div>
                ${token ? `<a href="/reviews/new/${this.bookId}" data-link>Leave a Review</a>` : ''}
                ${isAdmin ? `<a href="/books/edit/${this.bookId}" data-link>Edit</a>` : ''}
                ${isAdmin ? `<a href="/books/delete/${this.bookId}" data-link>Delete</a>` : ''}
            `;
        } catch (error) {
            console.error('Error:', error);
            return '<h1>Failed to load book details</h1>';
        }
    }
}
