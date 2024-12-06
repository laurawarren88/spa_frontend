import boilerplate from "../boilerplate.js";
import { fetchToken } from "../../../../utils/fetchToken.js";
import { showMessage } from "../../../../utils/messageAlert.js";

class EditReview extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Edit Review");
        this.reviewId = params.reviewId;
        this.reviewData = null;
    }

async getHtml() {
    try {
        const response = await fetchToken(`http://localhost:8080/api/reviews/edit/${this.reviewId}` , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return `
                <section class="message-container">
                    <div class="message-layout">
                        <h1 class="message-title">Please login to fetch review details</h1>
                    </div>
                </section>
            `;
        }

        const review = await response.json();
        this.reviewData = review;
        console.log('Review data:', review);

        const ratingHtml = `
            <div>
                <label class="form-label" for="rating"></label>
                <div class="star-rating">
                    <div class="stars">
                        ${[5,4,3,2,1].map(num => `
                            <span class="star ${num <= review.rating ? 'active' : ''}" data-rating="${num}">★</span>
                        `).join('')}
                    </div>
                    <input type="hidden" name="rating" id="rating" value="${review.rating}">
                </div>
            </div>
        `;

        return `
            <section class="bg-softWhite py-8 mt-20">
            
            <!-- Alert container -->
            <div id="alertContainer" class="hidden"></div>

                <div class="max-w-3xl mx-auto px-4">
                    <div class="bg-white rounded-lg shadow-lg p-6 border border-gold">

                    <h1 class="form-title items-center mb-3">Edit review details</h1>
                        <h3 class="review-title">${review.book.title}</h3>
                        <p class="font-lora mb-2 text-slate-700 leading-normal font-light italic">${review.book.author}</p>
                        <p class="text-sm text-gray-600">Reviewed by: ${review.username}</p>
                        <form id="editReviewForm" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-6">
                                    ${ratingHtml}
                                </div>
                                <div class="space-y-6">
                                    <label class="form-label" for="review">Your Review:</label>
                                    <textarea id="review" name="review" class="form-input min-h-[150px] resize-y" placeholder="Optional: Write your thoughts about this book">${review.review}</textarea>
                                </div>
                                <div class="flex flex-col mt-auto gap-3">
                                    <div class="flex flex-row justify-start items-center gap-4">
                                        <button type="submit" id="submit" class="btn-primary w-24 text-center">Update</button>
                                        <a href="/reviews" class="link w-24 text-center" data-link>Cancel</a>
                                    </div>
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
                        <h2 class="message-title">Failed to load review details</h2>
                        <p class="message-text">Please try again later.</p>
                    </div>
                </section>
            `;
        }
    }

    async afterRender() {
        const form = document.getElementById('editReviewForm');
        const stars = document.querySelectorAll('.star');
        const ratingInput = document.getElementById('rating');

        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = e.target.dataset.rating;
                console.log("Selected rating:", rating);
                ratingInput.value = rating;
                
                stars.forEach(s => {
                    s.classList.remove('active');
                    if (s.dataset.rating <= rating) {
                        s.classList.add('active');
                    }
                });
            });
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

            if (!formData.get('rating')) {
                showMessage('alertContainer', 'Please select a star rating', 'error');
                submitButton.disabled = false;
                return;
            }

            const reviewData = {
                id: this.reviewId,
                review: document.getElementById('review').value.trim(),
                rating: parseInt(formData.get('rating')),
                createdAt: this.reviewData.created_at,
                book: this.reviewData.book,
                user: {
                username: this.reviewData.user.username,
                email: this.reviewData.user.email,
                password: this.reviewData.user.password
                }
            };
            
            console.log('Submitting review data:', reviewData);

            try {
                const response = await fetch(`http://localhost:8080/api/reviews/edit/${this.reviewId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token.split('=')[1]}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reviewData)
                });

                console.log('Request URL:', `http://localhost:8080/api/reviews/edit/${this.reviewId}`);
                console.log('Request method:', 'PUT');
                console.log('Request body:', JSON.stringify(reviewData));
            
                if (response.status === 204 || response.ok) {
                    window.history.pushState(null, null, '/reviews');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                } else {
                    const errorText = await response.text();
                    console.log('Error response:', errorText);
                    const errorData = errorText ? JSON.parse(errorText) : {};
                    showMessage('alertContainer', errorData?.error || 'Failed to update review', 'error');
                }
            } catch (error) {
                console.error('Update failed:', error);
                showMessage('alertContainer', 'Failed to update review', 'error');
            }
            finally {
                submitButton.disabled = false;
            }
        });
    }
}

export default EditReview;
