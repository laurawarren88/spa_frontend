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
                        <button type="submit" id="submit">Create</button>
                        <a href="/books" data-link>Cancel</a>
                    </form>
                </div>
            </section>
        `;
    }

    async afterRender() { 
        document.querySelector('#newBookForm').addEventListener('submit', async (e) => {
            console.log('Form submitted');
            e.preventDefault();

            const formData = new FormData(e.target);
            const bookData = {
                title: formData.get('title'),
                author: formData.get('author'),
                category: formData.get('category'),
                description: formData.get('description')
            };

            console.log('Submitting book data:', bookData);

            try {
                const response = await fetch('http://localhost:8080/api/books', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookData)
                });

                console.log('Response status:', response.status);

                if (response.ok) {
                    alert('Book created successfully!');
                    window.history.pushState(null, null, '/books'); 
                    window.dispatchEvent(new PopStateEvent('popstate')); 
                } else {
                    const errorData = await response.json();
                    alert('Failed to create book.');
                    console.error('Error response:', errorData);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while creating the book.');
            }
        });
    }
}