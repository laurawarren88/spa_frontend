import boilerplate from "../boilerplate.js";
import { fetchToken } from "../../../../utils/fetchToken.js";
import { showMessage } from "../../../../utils/messageAlert.js";
import { BASE_URL } from '../../../../utils/config.js';

class EditBook extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Edit the Book");
        this.bookID = params.id;
        this.userID = params.userID;
    }

    async getHtml() {
        try {
            const response = await fetchToken(`${BASE_URL}/books/edit/${this.bookID}`, {
                method: 'GET',
            });

            if (!response.ok) {
                return `
                    <section class="message-container">
                        <div class="message-layout">
                            <h1 class="message-title">Please login to edit a book</h1>
                        </div>
                    </section>
                `;
            }
            
            const book = await response.json();

            return `
                <section class="bg-softWhite py-8 mt-20">
            
                <!-- Alert container -->
                <div id="alertContainer" class="hidden"></div>

                    <div class="max-w-3xl mx-auto px-4">
                        <div class="bg-white rounded-lg shadow-lg p-6 border border-gold">

                        <h1 class="form-title items-center mb-6">Edit book details</h1>

                            <form id="editBookForm" class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-6">
                                        <div>
                                            <label class="form-label" for="title">Book Title</label>
                                            <input type="text" name="title" class="form-input" value="${book.title}" required>
                                        </div>
                                        <div>
                                            <label class="form-label" for="author">Author</label>
                                            <input type="text" name="author" class="form-input" value="${book.author}" required>
                                        </div>
                                        <div>
                                            <label class="form-label" for="category">Category</label>                                        
                                            <input type="text" name="category" class="form-input" value="${book.category}"required>
                                        </div>
                                        <div>
                                            <label class="form-label" for="description">Description</label>
                                            <textarea name="description" class="form-input min-h-[150px] resize-y" required>${book.description}</textarea>
                                        </div>
                                    </div>
                                    <div class="space-y-6">
                                        <label class="form-label">Book Cover Image</label>
                                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                            <input type="file" id="imageInput" name="image" accept="image/*" class="hidden">
                                        <label for="imageInput" class="cursor-pointer">
                                            <img id="imagePreview" src="data:image/jpeg;base64,${book.image}" alt="${book.title}" class="mx-auto h-96 w-96 object-cover mb-2">
                                            <span class="border border-gold text-sm text-gray-500 m-3 rounded">Click to upload image</span>
                                        </label>
                                        </div> 
                                    </div>
                                </div>
                                <div class="flex flex-col mt-auto gap-3">
                                    <div class="flex flex-row justify-start items-center gap-4">
                                        <button type="submit" id="submit" class="btn-primary w-24 text-center">Update</button>
                                        <a href="/books" class="link w-24 text-center" data-link>Cancel</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            `;
        } catch (error) {
            if (error.message.includes('Please log in')) {
                return `
                <section class="message-container">
                    <div class="message-layout">
                        <h2 class="message-title">Authentication Required</h2>
                        <p class="message-text">Please <a href="/users/login" class="link" data-link>login</a> to edit books.</p>
                    </div>
                </section>
                `;
            }
            return `
                <section class="message-container">
                    <div class="message-layout">
                        <h2 class="message-title">Failed to load book details</h2>
                        <p class="message-text">Please try again later.</p>
                    </div>
                </section>
                `;
        }
    }
        
    async afterRender() {
        const form = document.getElementById('editBookForm');
        const imageInput = document.getElementById('imageInput');
        const imagePreview = document.getElementById('imagePreview');
        let currentImageBase64 = imagePreview.src.split(',')[1];
    
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    currentImageBase64 = e.target.result.split(',')[1];
                };
                reader.readAsDataURL(file);
            }
        });


        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            

            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            if (!token) {
                showMessage('alertContainer', 'Authentication required', 'error');
                return;
            }
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            
            try {
                const response = await fetch(`${BASE_URL}/books/edit/${this.bookID}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token.split('=')[1]}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: formData.get('title'),
                        author: formData.get('author'),
                        category: formData.get('category'),
                        description: formData.get('description'),
                        image: currentImageBase64
                    })
                });
        
                if (response.ok) {
                    window.history.pushState(null, null, `/books/${this.bookID}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                } else {
                    const errorText = await response.text();
                    console.log('Error response:', errorText);
                    const errorData = errorText ? JSON.parse(errorText) : {};
                    showMessage('alertContainer', errorData?.error || 'Update failed', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('alertContainer', 'Failed to update book', 'error');
            } finally {
                submitButton.disabled = false;
            }
        });
    }
}
export default EditBook;