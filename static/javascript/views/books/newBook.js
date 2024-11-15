import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Add a New Book");
    }

    async getHtml() {
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
                        <img id="imagePreview" style="max-width: 200px; display: none;">
                        <button type="submit" id="submit">Create</button>
                        <a href="/books" data-link>Cancel</a>
                    </form>
                </div>
            </section>
        `;
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
            
            // Create a fresh FormData instance
            const formData = new FormData();
            
            // Add each field individually
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
                console.log('Form data:', formData);
            }

            try {
                const response = await fetch('http://localhost:8080/api/books', {
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
