import boilerplate from "../boilerplate.js";
import { BASE_URL } from '../../../../utils/config.js';

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Book Details");
        this.bookId = params.id;
    }

    async getHtml() {
        try {
            if (!this.bookId) {  
                return ` 
                    <section class="message-container">
                        <div class="message-layout">
                            <h1 class="message-title">Book not found</h1>
                        </div>
                    </section>
                `;}

            const response = await fetch(`${BASE_URL}/books/${this.bookId}`);

            if (!response.ok) {
                return ` 
                    <section class="message-container">
                        <div class="message-layout">
                            <h1 class="message-title">Failed to fetch book</h1>
                        </div>
                    </section>
                `;}

            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
            const isAdmin = payload?.isAdmin || false;
            const book = await response.json();
    
            return `
            <section class="bg-softWhite py-8 mt-20">
                <div class="max-w-3xl mx-auto px-4">
                    <div class="bg-white rounded-lg shadow-lg p-6 border border-gold">
                       <h1 class="book-title">${book.title}</h1>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-6">
                                <p class="font-lora mb-2 text-slate-700 leading-normal font-light italic">${book.author}</p>
                                <p class="font-lora mb-2 rounded py-0.5 border border-gold text-xs text-slate-600 transition-all w-20 text-center uppercase tracking-wider">${book.category}</p>
                                <p class="font-lora mb-3 text-slate-800 leading-normal font-light">${book.description}</p>
                            </div>
                            <div class="book-image-container h-max">
                                <img src="data:image/jpeg;base64,${book.image}" alt="${book.title}" class="h-full w-full object-cover rounded-t-lg"/>
                            </div>
                        </div>
                        <div class="flex flex-col mt-auto gap-3">
                            <div class="flex flex-row justify-start items-center gap-4">
                                ${token ? `<a href="/reviews/new/${this.bookId}" class="btn-primary w-36 text-center" data-link>Leave a Review</a>` : ''}
                                ${isAdmin ? `
                                    <a href="/books/edit/${this.bookId}" class="link w-24 text-center" data-link>Edit</a>
                                    <a href="/books/delete/${this.bookId}" class="link w-24 text-center" data-link>Delete</a>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            `;
        } catch (error) {
            console.error('Error:', error);
            return ` 
                <section class="message-container">
                    <div class="message-layout">
                        <h1 class="message-title">Failed to load book details</h1>
                        <p class="message-text">Please try again</p>
                    </div>
                </section>
            `;
        }
    }
}
