import boilerplate from "../boilerplate.js";
import { fetchToken } from "../../../../utils/fetchToken.js";

class EditBook extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Edit the Book");
        // console.log('Params received:', params);
        this.bookId = params.id;
    }

    async getHtml() {
        try {
            const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

           if (!token) {
               return `
                   <div class="auth-error">
                       <h2>Authentication Required</h2>
                       <p>Please <a href="/users/login" data-link>login</a> to edit books.</p>
                   </div>
               `;
           }
            const response = await fetchToken(`http://localhost:8080/api/books/edit/${this.bookId}`, {
                method: 'GET',
            });
            
            const book = await response.json();

            return `
             <h1 class="">Edit Book</h1>
                <section class="">
                    <div id="booksContainer">
                        <form id="editBookForm" class="" onsubmit="return false">
                        <div>
                            <img src="data:image/jpeg;base64,${book.image}" alt="${book.title}">
                        </div>
                        <div>
                            <input type="text" name="title" value="${book.title}" placeholder="Title" required>
                            <input type="text" name="author" value="${book.author}" placeholder="Author" required>
                            <input type="text" name="category" value="${book.category}" placeholder="Category" required>
                            <textarea name="description" placeholder="Brief description of the book" required>${book.description}</textarea>
                        </div>
                        <div>
                            <button type="submit" id="submit">Update</button>
                            <a href="/books" data-link>Cancel</a>
                        </div>
                        </form>
                    </div>
                </section>
            `;
        } catch (error) {
            if (error.message.includes('Please log in')) {
                return `
                    <div class="auth-error">
                        <h2>Authentication Required</h2>
                        <p>Please <a href="/users/login" data-link>login</a> to edit books.</p>
                    </div>
                `;
            }
            return '<h1>Failed to load book details</h1>';
        }
    }
        
    async afterRender() {
        const form = document.getElementById('editBookForm');

        if (!form) {
            console.error('Edit form not found');
            return;
        }
        
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
                const response = await fetchToken(`http://localhost:8080/api/books/edit/${this.bookId}`, {
                    method: 'PUT',
                    body: JSON.stringify(bookData)
                });
    
                if (response.status === 401) {
                    window.location.href = '/user/login';
                    return;
                }
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

export default EditBook;