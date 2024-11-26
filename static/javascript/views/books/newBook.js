import boilerplate from "../boilerplate.js";
import { fetchToken } from "../../../../utils/fetchToken.js";
import { requireAuth } from "../../../../utils/authCheck.js";

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
                return '<h1>Please login to add a new book</h1>';
            }

        return `
            <h1 class="">Add a New Book</h1>
            <section class="">
                <div id="booksContainer">
                    <form id="newBookForm" class="" onsubmit="return false">
                        <input type="text" name="title" placeholder="Title" required>
                        <input type="text" name="author" placeholder="Author" required>
                        <input type="text" name="category" placeholder="Category" required>
                        <textarea name="description" placeholder="Brief description of the book" required></textarea>
                        <input type="file" name="image" accept="image/*" required>
                        <img id="imagePreview" display: none;">
                        <button type="submit" id="submit">Create</button>
                        <a href="/books" data-link>Cancel</a>
                    </form>
                </div>
            </section>
        `;
    } catch (error) {
        console.error('Error:', error);
        return '<h1>Failed to load book details</h1>';
    }
}

    async afterRender() {
        const form = document.querySelector('#newBookForm');
        const imagePreview = document.querySelector('#imagePreview');
    
        form.querySelector('input[name="image"]').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            
            formData.append('title', form.querySelector('[name="title"]').value);
            formData.append('author', form.querySelector('[name="author"]').value);
            formData.append('category', form.querySelector('[name="category"]').value);
            formData.append('description', form.querySelector('[name="description"]').value);

            const imageFile = form.querySelector('[name="image"]').files[0];
            if (imageFile) {
                if (imageFile.size > 20 * 1024 * 1024) { // 20MB in bytes
                    alert('Image file size must be less than 20MB');
                    return;
                }
                formData.append('image', imageFile);
                // console.log('Form data:', formData);
            }

            try {
                const response = await fetchToken('http://localhost:8080/api/books', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    window.history.pushState(null, null, '/books');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                } else {
                    const errorResponse = await response.json();
                    alert(errorResponse?.error || 'Failed to create book');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while creating the book.');
            }
        });
    }
}   
export default NewBook; 
