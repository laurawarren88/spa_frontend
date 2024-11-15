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
            <h1>Show Book Page</h1>
            <div id="booksContainer">
                <div>
                    <img src="data:image/jpeg;base64,${book.image}" alt="${book.title}">
                </div>
                <div>
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <p>${book.category}</p>
                    <p>${book.description}</p>
                </div>
                
                <div>
                    <a href="/books/edit/${book.id}" data-link>Edit</a>
                    <a href="/books/delete/${book.id}" data-link>Delete</a>
                    <a href="/books" data-link>Back to Books</a>
                </div>
            </div>
            `;
        } catch (error) {
            console.log('Response error:', error);
            return '<h1>Couldn\'t get the book details</h1>';
        }
    }
}