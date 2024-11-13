import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Books");
    }

    async getHtml() {
        try {
            const response = await fetch('localhost:8080/api/books');
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
    
            const data = await response.json();  // Directly parse the JSON response
            const books = data.books;
    
            console.log('Books data:', books);

            const booksHtml = books.map(book => `
                    <section class="">
                        <h3 class="">${book.title}</h3>
                        <p class="">${book.author}</p>
                        <p class="">${book.category}</p>
                        <p class="">${book.description}</p>
                        <a href="/books/${book._id}" data-link>View</a>
                        <a href="/books/edit/${book._id}" data-link>Edit</a>
                    </section>
                `).join('');

            return `
            <h1 class="main_heading">All Books</h1>
            <div id="booksContainer">${booksHtml}</div> <!-- This is where the books will be rendered -->
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
            `;
        } catch (error) {
            console.log('Response error:', error);
            return '<h1>Error loading books</h1>';
        }
    }
}