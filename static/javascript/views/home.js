import boilerplate from "./boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Home");
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
                    <p>Book Id:${book.id}</p>
                    <h3 class="">${book.title}</h3>
                    <p class="">${book.author}</p>
                    <p class="">${book.category}</p>
                    <p class="">${book.description}</p>
                    <a href="/books/${book.id}" data-link>View</a>
                    <a href="/books/edit/${book.id}" data-link>Edit</a>
                </section>
            `).join('') : '<p>No books available yet. Be the first to add a review!</p>';
    
            return `
                <section class="">
                    <div class="">
                        <h2>Have your say!</h2>
                    </div>
                </section>
    
                <section class="">
                    <div class="">
                        <h2 class="">Search for a book</h2>
                        <form action="/" method="get" class="">
                            <div class="">
                                <input type="text" name="title" id="" value="" placeholder="Search for a book by title" required>
                                <button type="search" value="go" id="">Search</button>
                            </div>
                            <div class="">
                                <a href="/books/search" data-link>Search for a book</a>
                            </div>
                        </form>
                    </div>
                </section>
    
                <h1 class="">Book Reviews</h1>
    
                <div id="booksContainer">${booksHtml}</div>
            `;
        } catch (error) {
            console.error('Error fetching books:', error);
            return '<h1>Error loading Home Page</h1>';
        }
    }
}    