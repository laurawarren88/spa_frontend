import boilerplate from "../boilerplate.js";
import { fetchToken } from "../../../../utils/fetchToken.js";
import { showMessage } from "../../../../utils/messageAlert.js";
import { BASE_URL } from '../../../../utils/config.js';

class DeleteReview extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Delete Review");
        this.reviewId = params.reviewId;
        this.bookId = params.bookId;
        this.userId = params.userId;
    }

    async getHtml() {
        try {
            const token = document.cookie.split('=')[1];
            // console.log(token);

            const response = await fetchToken(`${BASE_URL}/reviews/${this.reviewId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                return `
                    <section class="message-container">
                        <div class="message-layout">
                            <h1 class="message-title">Please login to delete a review</h1>
                        </div>
                    </section>
                `;
            }

            const review = await response.json();
            this.reviewData = review;
            // console.log('Review data:', review);
            this.bookId = review.book.id; 
            // console.log('Book ID:', this.bookId);
            this.userId = review.user._id;
            // console.log('User ID:', this.userId);

            return `
                <section class="bg-softWhite py-8 mt-20">

                <!-- Alert container -->
                <div id="alertContainer" class="hidden"></div>

                    <div class="max-w-3xl mx-auto px-4">
                        <div class="bg-white rounded-lg shadow-lg p-6 border border-gold">
                            <h1 class="form-title items-center mb-6">Delete Review</h1>
                            
                            <div class="">
                                <p class="font-playfair text-3xl text-slate-500 text-center mb-4">Are you sure you want to delete this review?</p>
                                
                                <h3 class="review-title">${review.book.title}</h3>
                                <p class="font-lora mb-2 text-slate-700 leading-normal font-light italic">${review.book.author}</p>
                                <p class="text-sm text-gray-600">Reviewed by: ${review.username || 'Unknown User'}</p>
                                <div class="rating mb-2">
                                    ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                                </div>
                                <blockquote class="font-lora text-justify text-slateGray mb-2">${review.review}</blockquote>
                            </div>
                            <div class="flex flex-col mt-auto gap-3">
                                <div class="flex flex-row justify-start items-center gap-4">
                                    <button type="button" id="confirmDelete" class="btn-primary w-36 text-center">Confirm Delete</button>
                                    <a href="/reviews" class="link w-24 text-center" data-link>Cancel</a>
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
                    <p class="message-text">Please <a href="/users/login" class="link" data-link>login</a> to delete reviews.</p>
                </div>
            </section>
            `;
        }
    }

    async afterRender() {
        const confirmButton = document.getElementById('confirmDelete');
        const alertContainer = document.getElementById('alertContainer');
        
        if (confirmButton) {    
            confirmButton.addEventListener('click', async () => {
                confirmButton.disabled = true;
                confirmButton.textContent = 'Deleting...';
    
                const token = document.cookie.split('; ').find(row => row.startsWith('token='));
                if (!token) {
                    // console.error('Token not found in cookies.');
                    showMessage(alertContainer, 'Authentication required', 'error');
                    return;
                }
    
                try {
                    console.log('Attempting to send DELETE request...');
                    const response = await fetchToken(`${BASE_URL}/reviews/delete/${this.reviewId}`, {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });

                    // console.log('Response received:', response);
                    // console.log('Response status:', response.status);
                
                    if (response.ok) {
                        console.log('Review deleted successfully');
                        window.history.pushState(null, null, '/reviews');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                    } else {
                        const errorData = await response.json();
                        console.error('Failed to delete review:', errorData);
                        showMessage(alertContainer, errorData?.message || 'Failed to delete review', 'error');
                    }

                } catch (error) {
                    console.log('Token:', `${token.split('=')[1]}`);
                    console.error('Error message:', error.message);
                    showMessage(alertContainer, 'Failed to delete review', 'error');
                } finally {
                    confirmButton.disabled = false;
                    confirmButton.textContent = 'Confirm Delete';
                }
            });
        }
    }
}

export default DeleteReview;
