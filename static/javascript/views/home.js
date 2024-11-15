import boilerplate from "./boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Home");
        this.searchResults = [];
    }

    async getHtml() {
        try {
            const response = await fetch('http://localhost:8080/api/');
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
                    <a href="/reviews/${book.id}" data-link>Leave a Review</a>
                    <a href="/books/edit/${book.id}" data-link>Edit</a>
                    <a href="/books/delete/${book.id}" data-link>Delete</a>
                </div>
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
                        <form id="searchForm" class="">
                            <div class="">
                                <input type="text" name="title" placeholder="Search for a book by title" required>
                                <button type="submit">Search</button>
                            </div>
                            <div class="">
                                <a href="/books/search" data-link>Advanced Search</a>
                            </div>
                        </form>
                    </div>
                </section>
    
                <h1 class="">Book Reviews</h1>

                <div id="searchResults"></div>
    
                <div id="booksContainer">${booksHtml}</div> 
            `;
        } catch (error) {
            console.error('Error fetching books:', error);
            return '<h1>Error loading Home Page</h1>';
        }
    }

    async afterRender() {
        const searchForm = document.getElementById('searchForm');
        const searchResults = document.getElementById('searchResults');
        const booksContainer = document.getElementById('booksContainer');

        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(searchForm);
            
            const searchQuery = formData.get('title');

        try {
            const response = await fetch(`http://localhost:8080/api/books/search?q=${encodeURIComponent(searchQuery)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                const data = await response.json();
                console.log('Search results:', data);
                
                if (data.books && data.books.length > 0) {
                    booksContainer.innerHTML = '';
                    searchResults.innerHTML = data.books.map(book => `
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
                                    <a href="/reviews/${book.id}" data-link>Leave a Review</a>
                                    <a href="/books/edit/${book.id}" data-link>Edit</a>
                                    <a href="/books/delete/${book.id}" data-link>Delete</a>
                                </div>
                            </div>
                        `).join('');
                    } else {
                        booksContainer.innerHTML = '';
                        searchResults.innerHTML = '<p>No books found.</p>';
                    }   

                    searchForm.reset();
                    
                } catch (error) {
                            console.log('Search error:', error);
                            searchResults.innerHTML = '<p>Error fetching search results.</p>';
                    }
                });

                const input = document.querySelector('input[name="title"]');
                input.addEventListener('input', () => {
                    if (input.value) {
                        searchResults.innerHTML = '';
                        booksContainer.style.display = 'block';    
                    }
                });
    }
}