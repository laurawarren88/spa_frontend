import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Books");
    }

    async getHtml() {
        try {
            const response = await fetch('http://localhost:8080/api/books');
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const data = await response.json();
            const books = data.books || [];  
    
            const booksHtml = books.length > 0 ? books.map(book => `
                <section class="">
                    <div>
                        <img src="data:image/jpeg;base64,${book.image}" alt="${book.title}">
                    </div>
                    <div>
                        <h3 class="">${book.title}</h3>
                        <p class="">${book.author}</p>
                        <p class="">${book.category}</p>
                        <p class="">${book.description}</p>
                    </div>
                    <div>
                        <a href="/books/${book.id}" data-link>View</a>
                        <a href="/books/edit/${book.id}" data-link>Edit</a>
                        <a href="/books/delete/${book.id}" data-link>Delete</a>
                    </div>
                </section>
            `).join('') : '<p>No books available. Add a new book to get started!</p>';
    
            return `
                <h1 class="main_heading">All Books</h1>
                <section class="">
                    <div class="">
                        <a href="/books/new" data-link>Add Book</a>
                    </div>
                    <div class="">
                        <h2 class="">Search for a book</h2>
                        <form action="/" method="get" class="">
                            <div class="">
                                <input type="text" name="title" placeholder="Search for a book by title" required>
                                <button type="search">Search</button>
                            </div>
                        </form>
                    </div>
                </section>
                <div id="booksContainer">
                    ${booksHtml}
                </div>
            `;
        } catch (error) {
            console.log('Response error:', error);
            return '<h1>Error loading books</h1>';
        }
    }
}    