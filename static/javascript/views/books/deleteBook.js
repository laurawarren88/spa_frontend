import boilerplate from "../boilerplate.js";
import { fetchToken } from "../../../../utils/fetchToken.js";


class DeleteBook extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Delete Book");
        this.bookId = params.id;
}

async getHtml() {
    try {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
  
    const response = await fetchToken(`http://localhost:8080/api/books/${this.bookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    });
  
    const book = await response.json();
  
    return `
        <div class="delete-confirmation">
          <h1>Delete Book</h1>
          <div class="book-content">
            <p>Are you sure you want to delete "${book.title}"?</p>
            <p>By: ${book.author}</p>
          </div>
          <div class="action-buttons">
            <button type="button" id="confirmDelete">Confirm Delete</button>
            <a href="/books" data-link>Cancel</a>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error:', error);
      return '<h1>Failed to load book details</h1>';
    }
}
  
async afterRender() {
    const confirmButton = document.getElementById('confirmDelete');
    if (confirmButton) {
        confirmButton.addEventListener('click', async () => {
            try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1];
    
            const response = await fetchToken(`http://localhost:8080/api/books/delete/${this.bookId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                window.history.pushState(null, null, '/books');
                window.dispatchEvent(new PopStateEvent('popstate'));
            }
            } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete book');
            }
        });
    }
}}

  

export default DeleteBook;
