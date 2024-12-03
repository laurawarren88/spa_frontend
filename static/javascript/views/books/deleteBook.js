import boilerplate from "../boilerplate.js";
import { fetchToken } from "../../../../utils/fetchToken.js";
import { showMessage } from "../../../../utils/messageAlert.js";

class DeleteBook extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Delete Book");
        this.bookId = params.id;
}

async getHtml() {
    try {
      const response = await fetchToken(`http://localhost:8080/api/books/${this.bookId}`, {
      method: 'GET',
      Credentials: 'include',
    });

    if (!response.ok) {
      return `
          <section class="message-container">
              <div class="message-layout">
                  <h1 class="message-title">Please login to delete a book</h1>
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
            <h1 class="form-title items-center mb-6">Delete Book</h1>
              <div class="">
                <p class="font-playfair text-3xl text-slate-500 mb-4">Are you sure you want to delete this book?</p>
                <p class="text-3xl text-slate-500 mb-4"><span class="font-lora font-bold">"${book.title}"</span>?</p>
                <p class="font-playfair text-3xl text-slate-500 mb-8">By: <span class="font-lora font-bold">${book.author}</span></p>
              </div>

            <div class="flex flex-col mt-auto gap-3">
              <div class="flex flex-row justify-start items-center gap-4">
                <button type="submit" id="submit" class="btn-primary w-36 text-center">Confirm Delete</button>
                <a href="/books" class="link w-24 text-center" data-link>Cancel</a>
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
                <h2 class="message-title">Authentication Required</h2>
                <p class="message-text">Please <a href="/users/login" class="link" data-link>login</a> to delete books.</p>
            </div>
        </section>
        `;
    }
}

  async afterRender() {
    const confirmButton = document.getElementById('submit');
    const alertContainer = document.getElementById('alertContainer');
    
    if (confirmButton) {
      // console.log('Confirm button found:', confirmButton);

      confirmButton.addEventListener('click', async () => {
        // console.log('Delete button clicked.');
        confirmButton.disabled = true;
        confirmButton.textContent = 'Deleting...';

        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            if (!token) {
                showMessage(alertContainer, 'Authentication required', 'error');
                return;
            }
        
        try {
            // console.log('Sending DELETE request to API...');
            // console.log('Book ID:', this.bookId);
            
            const response = await fetch(`http://localhost:8080/api/books/delete/${this.bookId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.split('=')[1]}`,
                },
                Credentials: 'include',
            });

            // console.log('Response received:', response);
            // console.log('Response status:', response.status);

            if (response.ok) {
                // console.log('Book deleted successfully. Redirecting to /books...');
                window.history.pushState(null, null, '/books');
                window.dispatchEvent(new PopStateEvent('popstate'));
            } else {
                const errorData = await response.json();
                // console.error('Failed to delete book. Server responded with:', errorData);

                showMessage(alertContainer, errorData?.message || 'Failed to delete book', 'error');
            }
        } catch (error) {
          // console.error('Delete error:', error);
          // console.error('Error type:', error.name);
          // console.error('Error message:', error.message);
          // console.error('Stack trace:', error.stack);

          showMessage(alertContainer, 'Network connection error - please try again', 'error');
        } finally {
            confirmButton.disabled = false;
            confirmButton.textContent = 'Confirm Delete';
        }
    });
  }
}
}


export default DeleteBook;
