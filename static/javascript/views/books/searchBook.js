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
            return `
            <section class="bg-softWhite">

            <!-- Alert container -->
            <div id="alertContainer" class="hidden"></div>

            <div class="flex flex-col items-center justify-center mx-auto pt-36 mb-10 h-max">

            <div class="form-container">
                <div class="form-layout">
                    <h1 class="form-title">Advanced Search Options</h1>

            <form id="searchForm" class="space-y-4 md:space-y-6">
                <div>
                    <label class="form-label" for="title">Title</label>
                    <input type="text" name="title" class="form-input" placeholder="Oliver Twist">
                </div>
                <div>
                    <p class="font-lora mb-3 text-slate-800 leading-normal font-light text-center">and/or</p>
                </div>
                <div>
                    <label class="form-label" for="author">Author</label>
                    <input type="text" name="author" class="form-input" placeholder="Charles Dickens">
                </div>
                <div>
                    <p class="font-lora mb-3 text-slate-800 leading-normal font-light text-center">and/or</p>
                </div>
                <div>
                    <label class="form-label" for="category">Category</label>
                    <input type="text" name="category" class="form-input" placeholder="Childrens">
                </div>
                <div class="flex flex-col mt-auto gap-3">
                    <div class="flex flex-row justify-start items-center gap-4">
                        <button type="submit" class="btn-primary w-24 text-center" id="submit">Search</button>
                        <a href="/books" class="link w-24 text-center" data-link><< Back</a>
                    </form>
                </div>
            </section>

            <div id="searchResults" class="max-w-7xl mx-auto"></div>
        `;
        } catch (error) {
            console.error(error);
            return `
            <section class="message-container">
                <div class="message-layout">
                    <h1 class="message-title">Error loading search form</h1>
                    <p class="message-text">Please try again later</p>
                </div>
            </section>
        `;
        }
    }

async afterRender() {
    const searchForm = document.getElementById('searchForm');
    const searchResults = document.getElementById('searchResults');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(searchForm);
        
        const searchParams = {
            title: formData.get('title').trim(),
            author: formData.get('author').trim(),
            category: formData.get('category').trim()
        };

        const filteredParams = Object.entries(searchParams)
            .filter(([_, value]) => value !== '')
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        try {
            const response = await fetch(`http://localhost:8080/api/books/search?${filteredParams}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }

            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
            const isAdmin = payload?.isAdmin || false;
            const data = await response.json();
    
            if (data.books && data.books.length > 0) {
                searchResults.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        ${data.books.map(book => `
                            <div class="book-card">
                                <div class="book-image-container">
                                    <img src="data:image/jpeg;base64,${book.image}" alt="${book.title}" class="h-full w-full object-cover" />
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
                searchResults.innerHTML = `
                    <section class="message-container">
                        <div class="message-layout">
                            <h1 class="message-title">No books found for the given search criteria.</h1>
                            <p class="message-text">Please try another search</p>
                        </div>
                    </section>
                `;
            }

            searchForm.reset();

        } catch (error) {
            console.log('Search error:', error);
            searchResults.innerHTML = `
                <section class="message-container">
                    <div class="message-layout">
                        <h1 class="message-title">Error fetching search results</h1>
                        <p class="message-text">Please try again</p>
                    </div>
                </section>
            `;
        }
    });

        const input = document.querySelector('input[name="title"]', 'input[name="author"]', 'input[name="category"]');
        input.addEventListener('input', () => {
            if (input.value) {
                searchResults.innerHTML = '';
            }
        })
    }
}