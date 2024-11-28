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

            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
            const isAdmin = payload?.isAdmin || false;
            
            const data = await response.json();
            const books = data.books || [];

            // Display just 12 books and random every page load
            const randomBooks = books
            .sort(() => Math.random() - 0.5)
            .slice(0, 12);
    
            const booksHtml = randomBooks.length > 0 ? `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                ${randomBooks.map(book => `
                    <div class="book-card">
                        <div class="book-image-container">
                            <img src="data:image/jpeg;base64,${book.image}" alt="${book.title}" class="h-full w-full object-cover rounded-t-lg"/>
                        </div>
                        <div class="book-content">
                            <div>
                                <h3 class="book-title">${book.title}</h3>
                                <p class="font-lora mb-2 text-slate-700 leading-normal font-light italic">${book.author}</p>
                                <p class="font-lora mb-2 rounded py-0.5 border border-gold text-xs text-slate-600 transition-all w-20 text-center uppercase tracking-wider">${book.category}</p>
                                <p class="font-lora mb-3 text-slate-800 leading-normal font-light">${book.description.substring(0, 48)}${book.description.length > 48 ? '...' : ''}</p>
                            </div>
                            <div class="flex flex-col mt-auto gap-3">
                                <div class="flex flex-row justify-start items-center gap-4">
                                    <a href="/books/${book.id}" class="btn-primary w-24 text-center" data-link>View</a>
                                    ${token ? `<a href="/reviews/new/${book.id}" class="btn-secondary w-24 text-center" data-link>Review</a>` : ''}
                                    ${isAdmin ? `
                                        <a href="/books/edit/${book.id}" class="link" data-link>Edit</a>
                                        <a href="/books/delete/${book.id}" class="link" data-link>Delete</a>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
                </div>
                ` :  `
                <section class="message-container">
                    <div class="message-layout">
                        <h1 class="message-title">No books available yet.</h1>
                        <p class="message-content">Please come back later.</p>
                    </div>
                </section>
            `;
    
            return `
            <!-- Hero Section -->
                <section class="relative h-screen">
                    <img class="absolute w-full h-full object-cover" src="/static/images/header.jpg" alt="Book">
                    <div class="relative max-w-7xl mx-auto h-full">
                        <div class="absolute top-1/3 right-4 text-right">
                            <h3 class="font-playfair text-3xl text-slate-300 mb-4">Have a Favourite Book?</h3>
                            <p class="font-lora text-xl text-slate-300 italic mb-4">Want everyone to know about it?</p>
                            <a href="/reviews" class="font-lora inline-block btn-primary" data-link>Leave a Review</a>
                        </div>
                    </div>
                </section>

            <!-- Heading Section -->
                <section class="max-w-7xl mx-auto">
                    <div class="title-section">
                        <h1 class="h1-primary">HAVE YOUR SAY</h1>
                    </div>
                </section>

            <!-- Search Section -->
                <section class="max-w-7xl mx-auto mt-12">
                    <div class="flex justify-end">
                        <div class="w-96">
                            <div class="bg-white px-1 py-1 rounded-full border border-black overflow-hidden mb-2">
                                <form id="searchForm" class="flex items-center">
                                    <input type="text" name="title" placeholder="Search for a book by title" class="w-full font-lora border-none bg-white pl-4 focus:outline-none" required>
                                    <button type="submit" class="font-lora bg-gold hover:bg-brightGold text-slateGray rounded-full px-5 py-2.5 transition-all duration-300">Search</button>
                                </form>
                            </div>
                            <div class="text-center">
                                <a href="/books/search" class="font-lora text-slate-500 text-sm hover:text-gold" data-link>Advanced Search</a>
                            </div>
                        </div>
                    </div>
                </section>

            <!-- Search Results -->
                <section id="searchResults" class="max-w-7xl mx-auto">
                </section>
    
            <!-- Books Section -->
                <section id="booksContainer" class="max-w-7xl mx-auto">
                    ${booksHtml}
                </section> 
            `;
        } catch (error) {
            // console.error('Error fetching books:', error);
            return `
                <section class="message-container">
                    <div class="message-layout">
                        <h1 class="message-title">Error loading Home Page</h1>
                        <p class="message-content">Please try again.</p>
                    </div>
                </section>
            `;
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
            const response = await fetch(`http://localhost:8080/api/books?q=${encodeURIComponent(searchQuery)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch search results');
                }

                const token = document.cookie.split('; ').find(row => row.startsWith('token='));
                const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
                const isAdmin = payload?.isAdmin || false;
                
                const data = await response.json();
                // console.log('Search results:', data);
                
                if (data.books && data.books.length > 0) {
                    booksContainer.innerHTML = '';
                    searchResults.innerHTML = `
                     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
                    ${data.books.map(book => `
                        <div class="book-card">
                            <div class="book-image-container">
                                <img src="data:image/jpeg;base64,${book.image}" alt="${book.title}" class="h-full w-full object-cover"/>
                            </div>
                            <div class="book-content">
                                <div>
                                    <h3 class="book-title">${book.title}</h3>
                                    <p class="font-lora mb-2 text-slate-700 leading-normal font-light italic">${book.author}</p>
                                    <p class="font-lora mb-2 rounded py-0.5 border border-gold text-xs text-slate-600 transition-all w-20 text-center uppercase tracking-wider">${book.category}</p>
                                    <p class="font-lora mb-3 text-slate-800 leading-normal font-light">${book.description.substring(0, 48)}${book.description.length > 48 ? '...' : ''}</p>
                                </div>
                                <div class="flex flex-col mt-auto gap-3">
                                    <div class="flex flex-row justify-start items-center gap-4">
                                        <a href="/books/${book.id}" class="btn-primary w-24 text-center" data-link>View</a>
                                        ${token ? `<a href="/reviews/new/${book.id}" class="btn-secondary w-24 text-center" data-link>Review</a>` : ''}
                                        ${isAdmin ? `
                                            <a href="/books/edit/${book.id}" class="link" data-link>Edit</a>
                                            <a href="/books/delete/${book.id}" class="link" data-link>Delete</a>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        `).join('')}
                        </div>
                    `;
                    } else {
                        booksContainer.innerHTML = '';
                        searchResults.innerHTML = ` 
                            <section class="message-container">
                                <div class="message-layout">
                                    <h1 class="message-title">No books found</h1>
                                </div>
                            </section>
                        `;
                    }   

                    searchForm.reset();
                    
                } catch (error) {
                        // console.log('Search error:', error);
                        searchResults.innerHTML = ` 
                            <section class="message-container">
                                <div class="message-layout">
                                    <h1 class="message-title">Error fetching search results.</h1>
                                    <p class="message-text">Please try again</p>
                                </div>
                            </section>
                        `;
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