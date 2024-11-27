import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Books");
        this.searchResults = [];
    }

    async getHtml() {
        try {
            const response = await fetch('http://localhost:8080/api/books');
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }

            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
            const isAdmin = payload?.isAdmin || false;
            
            const data = await response.json();
            const books = data.books || [];  

            // Display just 50 books and random every page load
            const randomBooks = books
            .sort(() => Math.random() - 0.5)
            .slice(0, 50);
    
            const booksHtml = randomBooks.length > 0 ? `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
                ${randomBooks.map(book => `
                    <div class="relative flex flex-col bg-white border border-black rounded min-h-[500px]">
                        <div class="relative h-64 overflow-hidden">
                            <img src="data:image/jpeg;base64,${book.image}" alt="${book.title}" class="h-full w-full object-cover" />
                        </div>
                        <div class="p-4 flex flex-col justify-between flex-grow">
                            <div>
                                <h3 class="mb-3 text-slate-600 text-xl font-semibold">${book.title}</h3>
                                <p class="mb-3 text-slate-500 leading-normal font-light">${book.author}</p>
                                <p class="mb-3 rounded bg-cyan-400 py-0.5 border border-transparent text-xs text-white transition-all w-20 text-center">${book.category}</p>
                                <p class="mb-4 text-slate-600 leading-normal font-light">${book.description.substring(0, 48)}${book.description.length > 48 ? '...' : ''}</p>
                            </div>
                            <div class="flex flex-col mt-auto gap-3">
                                <div class="grid grid-flow-col justify-start gap-4">
                                    <a href="/books/${book.id}" class="btn-secondary" data-link>View</a>
                                    ${token ? `<a href="/reviews/new/${book.id}" class="btn-primary" data-link>Review</a>` : ''}
                                </div>
                                ${isAdmin ? `
                                <div class="grid grid-flow-col justify-start gap-4">
                                    <a href="/books/edit/${book.id}" class="btn-edit" data-link>Edit</a>
                                    <a href="/books/delete/${book.id}" class="btn-delete" data-link>Delete</a>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
                </div>
                ` : '<p>No books available yet. Be the first to add a review!</p>';
    
    
            return `
            <!-- Hero Section -->
                <section class="relative h-screen">
                    <img class="absolute w-full h-full object-cover" src="/static/images/lotsofbooks.jpg" alt="Book">
                    <div class="relative max-w-7xl mx-auto h-full">
                        <div class="absolute top-1/3 right-4">
                            <div class="bg-white/75 p-6 rounded-lg relative before:absolute before:right-4 before:-bottom-3 before:w-4 before:h-4 before:bg-white/75 before:rotate-45">
                                <h3 class="text-3xl text-slate-500">Whats your next read?</h3>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Heading Section -->
                    <section class="max-w-7xl mx-auto">
                        <div class="title-section">
                            <h1 class="h1-primary">All Books</h1>
                        </div>
                    </section>

                <!-- Add a new book button -->
                    <section class="">
                        <div class="">
                            ${isAdmin ? `<a href="/books/new" data-link>Add Book</a>` : ''}
                        </div>
                    </section>

                <!-- Search Section -->
                    <section class="max-w-7xl mx-auto mt-12">
                        <div class="flex justify-end">
                            <div class="w-96">
                                <div class="bg-white px-1 py-1 rounded-full border border-black overflow-hidden mb-2">
                                    <form id="searchForm" class="flex items-center">
                                        <input type="text" name="title" placeholder="Search for a book by title" class="w-full border-none bg-white pl-4 focus:outline-none" required>
                                        <button type="submit" class="bg-amber-400 hover:bg-amber-200 transition-all text-slate-500 rounded-full px-5 py-2.5">Search</button>
                                    </form>
                                </div>
                                <div class="text-center">
                                    <a href="/books/search" class="text-slate-500 text-sm hover:text-amber-400" data-link>Advanced Search</a>
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
        }  catch (error) {
            console.error('Error:', error);
            return '<h1>Error loading books</h1>';
        }
    }
        
        async afterRender() {
            const searchForm = document.getElementById('searchForm');
            const searchResults = document.getElementById('searchResults');
            const booksContainer = document.getElementById('booksContainer');

            searchForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(searchForm);
                const searchQuery = formData.get('title');

                try {
                    const response = await fetch(`http://localhost:8080/api/books/search?q=${encodeURIComponent(searchQuery)}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch search results');
                    }

                    const data = await response.json();
                    console.log('Search results:', data);

                    if (data.books && data.books.length > 0) {
                        booksContainer.innerHTML = '';
                        searchResults.innerHTML = `
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
                                ${data.books.map(book => `
                                    <div class="relative flex flex-col bg-white border border-black rounded min-h-[500px]">
                                        <div class="relative h-64 overflow-hidden">
                                            <img src="data:image/jpeg;base64,${book.image}" alt="${book.title}" class="h-full w-full object-cover" />
                                        </div>
                                        <div class="p-4 flex flex-col justify-between flex-grow">
                                            <div>
                                                <h3 class="mb-3 text-slate-600 text-xl font-semibold">${book.title}</h3>
                                                <p class="mb-3 text-slate-500 leading-normal font-light">${book.author}</p>
                                                <p class="mb-3 rounded bg-cyan-400 py-0.5 border border-transparent text-xs text-white transition-all w-20 text-center">${book.category}</p>
                                                <p class="mb-4 text-slate-600 leading-normal font-light">${book.description.substring(0, 48)}${book.description.length > 48 ? '...' : ''}</p>
                                            </div>
                                            <div class="flex flex-col mt-auto gap-3">
                                                <div class="grid grid-flow-col justify-start gap-4">
                                                    <a href="/books/${book.id}" class="btn-secondary" data-link>View</a>
                                                    ${token ? `<a href="/reviews/new/${book.id}" class="btn-primary" data-link>Review</a>` : ''}
                                                </div>
                                                ${isAdmin ? `
                                                <div class="grid grid-flow-col justify-start gap-4">
                                                    <a href="/books/edit/${book.id}" class="btn-edit" data-link>Edit</a>
                                                    <a href="/books/delete/${book.id}" class="btn-delete" data-link>Delete</a>
                                                </div>
                                                ` : ''}
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>`;
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