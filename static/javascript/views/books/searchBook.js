import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Search Books");
        this.searchResults = [];
        this.searchOptions = {};
        this.bookID = params.id;
    }

    async getHtml() {
        return `
            <h1 class="">Advanced Search Options</h1>
            <section class="">
                <div class="">
                    <h2 class="">Search for a book</h2>
                    <form id="searchForm" class="">
                        <input type="text" name="title" class="" placeholder="Title">
                        <p class="">and/or</p>
                        <input type="text" name="author" class="" placeholder="Author">
                        <p class="">and/or</p>
                        <input type="text" name="category" class="" placeholder="Category">
                        <button type="submit" id="submit">Search</button>
                        <a href="/books" data-link><< Back</a>
                    </form>
                </div>
            </section>
            <div id="searchResults"></div>
        `;
    }

    async afterRender() {
        const form = document.getElementById('searchForm');
        const resultsDiv = document.getElementById('searchResults');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            const searchQuery = {
                title: formData.get('title'),
                author: formData.get('author'),
                category: formData.get('category')
            };
            
            try {
                const response = await fetch(`http://localhost:8080/api/books/search?q=${encodeURIComponent(searchQuery.title || searchQuery.author || searchQuery.category)}`);
                const data = await response.json();
                console.log('Search results:', data);

                if (data.books && data.books.length > 0) {
                    resultsDiv.innerHTML = data.books.map(book => `
                        <div class="book-card">
                            <p>${ this.bookID }</p>
                            <h3>${book.title}</h3>
                            <p>Author: ${book.author}</p>
                            <p>Category: ${book.category}</p>
                            <a href="/books/${book.id}" data-link>View Details</a>
                        </div>
                    `).join('');
                } else {
                    resultsDiv.innerHTML = '<p>No books found for the given search criteria.</p>';
                }
            } catch (error) {
                console.error('Search error:', error);
            }
        });
    }
}        
