import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Edit the Book");
        console.log('Params received:', params);
        this.bookId = params.id;
    }

    async getHtml() {
        try {
            const response = await fetch(`http://localhost:8080/api/books/edit/${this.bookId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch book');
            }
            
            const book = await response.json();

            return `
             <h1 class="">Edit Book</h1>
                <section class="">
                    <div id="booksContainer">
                        <form id="editBookForm" class="" onsubmit="return false">
                            <input type="text" name="title" value="${book.title}" placeholder="Title" required>
                            <input type="text" name="author" value="${book.author}" placeholder="Author" required>
                            <input type="text" name="category" value="${book.category}" placeholder="Category" required>
                            <textarea name="description" placeholder="Brief description of the book" required>${book.description}</textarea>
                            <button type="submit" id="submit">Update</button>
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
        const form = document.getElementById('editBookForm');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const bookData = {
                title: formData.get('title'),
                author: formData.get('author'),
                category: formData.get('category'),
                description: formData.get('description')
            };
    
            try {
                const response = await fetch(`http://localhost:8080/api/books/edit/${this.bookId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookData)
                });
    
                if (response.ok) {
                    window.history.pushState(null, null, `/books/${this.bookId}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                
                } else {
                    const error = await response.json();
                    throw new Error(error.message);
                }
            } catch (error) {
                console.error('Update failed:', error);
                alert('Failed to update book');
            }
        });
    }
}    