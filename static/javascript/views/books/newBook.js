import boilerplate from "../boilerplate.js";
import { fetchToken } from "../../../../utils/fetchToken.js";
import { showMessage } from "../../../../utils/messageAlert.js";

class NewBook extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Add a New Book");
    }

    async getHtml() {
        try {
            const response = await fetchToken('http://localhost:8080/api/books/new', {
                method: 'GET',
            });

            if (!response.ok) {
                return ` 
                    <section class="message-container">
                        <div class="message-layout">
                            <h1 class="message-title">Please login to add a new book</h1>
                        </div>
                    </section>
                `;}

        return `            
            <section class="bg-softWhite py-8 mt-20">
                <div class="max-w-3xl mx-auto px-4">

                <!-- Alert container -->
                <div id="alertContainer" class="hidden"></div>

                <!-- Form Container -->
                    <div class="bg-white rounded-lg shadow-lg p-6 border border-gold">
                       
                        <h1 class="form-title items-center mb-6">Input book details</h1>

                        <form id="newBookForm" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-6">
                                    <div>
                                        <label class="form-label" for="title">Book Title</label>
                                        <input type="text" name="title" class="form-input" placeholder="Oliver Twist" required>
                                    </div>
                                    <div>
                                        <label class="form-label" for="author">Author</label>
                                        <input type="text" name="author" class="form-input" placeholder="Charles Dickens" required>
                                    </div>
                                    <div>
                                        <label class="form-label" for="category">Category</label>
                                        <input type="text" name="category" class="form-input" placeholder="Childrens" required>
                                    </div>
                                    <div>
                                        <label class="form-label" for="description">Description</label>
                                        <textarea name="description" class="form-input min-h-[150px] resize-y" placeholder="Enter a detailed description of the book" required></textarea>
                                    </div>
                                </div>
                                <div class="space-y-6">
                                    <div class="book-image-upload">
                                        <label class="form-label">Book Cover Image</label>
                                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                            <input type="file" name="image" accept="image/*" class="hidden" id="imageInput" required>
                                            <label for="imageInput" class="cursor-pointer">
                                                <img id="imagePreview" class="mx-auto h-96 w-96 object-cover mb-2">
                                                <span class="border border-gold text-sm text-gray-500 m-3 rounded">Click to upload image</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" id="submit" class="btn-primary w-full">Create</button>
                            <div class="flex justify-center mt-4">
                                <a href="/books" class="link flex items-center text-center" data-link>Cancel</a>
                            </div>
                        </form>
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

    async afterRender() {
        const form = document.getElementById('newBookForm');
        const imageInput = document.getElementById('imageInput');
        const imagePreview = document.getElementById('imagePreview');
    
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
           const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Creating...';

            const formData = new FormData(form);
            // console.log('Form Data:', formData);
            // console.log('Form Data:', [...formData.entries()]);

            try {
                const response = await fetchToken('http://localhost:8080/api/books', {
                    method: 'POST',
                    body: formData
                });

            if (response.ok) {
                window.history.pushState(null, null, '/books');
                window.dispatchEvent(new PopStateEvent('popstate'));
            } else {
                const data = await response.json();
                console.error("Error:", error);
                showMessage('alertContainer', data?.error || 'Failed to create book', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('alertContainer', 'An error occurred while creating the book', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Create';
        }
        });
    }
}

export default NewBook;