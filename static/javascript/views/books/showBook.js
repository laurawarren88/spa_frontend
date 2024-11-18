import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Book Details");
        console.log('Params received:', params);
        this.bookId = params.id;
    }

    async getHtml() {
        try {
            console.log('Fetching book with ID:', this.bookId);

            if (!this.bookId) {
                throw new Error('Book ID is required');
            }

            const response = await fetch(`http://localhost:8080/api/books/${this.bookId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch book');
            }
    
            const book = await response.json();
    
            return `
                <h1>Book Page for ${this.params.id}</h1>
                <div id="booksContainer">
                    <h2>${book.title}</h2>
                    <p>${book.author}</p>
                    <p>${book.category}</p>
                    <p>${book.description}</p>
                </div>
                <a href="/books/edit/${this.bookId}" data-link>Edit</a>
                <a href="/books/delete/${this.bookId}" data-link>Delete</a>
                <a href="/reviews/new/${this.bookId}" data-link>Leave a Review</a>
            `;
        } catch (error) {
            console.error('Error:', error);
            return '<h1>Failed to load book details</h1>';
        }
    }
}
