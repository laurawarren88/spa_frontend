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
        try {
            const response = await fetch('http://localhost:8080/api/books/search');
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
        } catch (error) {
            console.error(error);
        }
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
                
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }

                const token = document.cookie.split('; ').find(row => row.startsWith('token='));
                const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
                const isAdmin = payload?.isAdmin || false;

                const data = await response.json();
                // // console.log('Search results:', data);

                if (data.books && data.books.length > 0) {
                    resultsDiv.innerHTML = data.books.map(book => `
                        <div class="book-card">
                            <div>
                                <img src="data:image/jpeg;base64,${book.image}" alt="${book.title}">
                            </div>
                            <div>
                                <h3>${book.title}</h3>
                                <p>Author: ${book.author}</p>
                                <p>Category: ${book.category}</p>
                                <p>Description: ${book.description}</p>
                            </div>
                            <div>
                                <a href="/books/${book.id}" data-link>View Details</a>
                                ${token ? `<a href="/reviews/${book.id}" data-link>Leave a Review</a>` : ''}
                                ${isAdmin ? `<a href="/books/edit/${book.id}" data-link>Edit</a>` : ''}
                                ${isAdmin ? `<a href="/books/delete/${book.id}" data-link>Delete</a>` : ''}
                            </div>
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

