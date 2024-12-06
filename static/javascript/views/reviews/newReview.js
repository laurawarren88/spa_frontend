import boilerplate from "../boilerplate.js";
import { fetchToken } from "../../../../utils/fetchToken.js";
import { showMessage } from "../../../../utils/messageAlert.js";

class NewReview extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Add Review");
        this.bookId = params.bookId;
    }

    async getHtml() {
        try {
            const response = await fetchToken(`http://localhost:8080/api/reviews/new/${this.bookId}`);
            const data = await response.json();

            console.log('API Response:', data);
    
            if (!data.book || !data.user) {
                throw new Error("Incomplete data received from API");
            }
    
            const book = data.book;
            const user = data.user;

            // ** Uncomment for debugging **
            // console.log('Book Data:', this.params);
            // console.log('Book ID:', this.bookId);
            // console.log('Book Title:', bookData.title);

            const ratingHtml = `
                <div>
                    <label class="form-label" for="rating">Rating:</label>
                    <div class="star-rating">
                        <div class="stars">
                            ${[5,4,3,2,1].map(num => `
                                <span class="star" data-rating="${num}">★</span>
                            `).join('')}
                        </div>
                        <input type="hidden" name="rating" id="rating" value="">
                    </div>
                </div>
            `;

            return `
            <section class="bg-softWhite py-8 mt-20">
                <div class="max-w-3xl mx-auto px-4">

                <!-- Alert container -->
                <div id="alertContainer" class="hidden"></div>

                <!-- Form Container -->
                    <div class="bg-white rounded-lg shadow-lg p-6 border border-gold">
                       
                        <h1 class="form-title items-center mb-6">${user.username}, leave a review for ${book.title}</h1>

                            <form id="reviewForm" class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-6">
                                        ${ratingHtml}
                                    </div>
                                    <div class="space-y-6">
                                        <label class="form-label" for="review">Your Review:</label>
                                        <textarea id="review" name="review" class="form-input min-h-[150px] resize-y" placeholder="Optional: Write your thoughts about this book"></textarea>
                                    </div>

                                    <button type="submit" id="submit" class="btn-primary w-full">Submit Review</button>
                                    <div class="flex justify-center mt-4">
                                        <a href="/reviews" class="link flex items-center text-center" data-link>Cancel</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            return ` 
                <section class="message-container">
                    <div class="message-layout">
                        <h1 class="message-title">Error loading review form</h1>
                        <p class="message-text">Please try again</p>
                    </div>
                </section>
            `;
        }
    }

    async afterRender() {
        const form = document.getElementById('reviewForm');
        if (!form) {
            console.error('Form element not found');
            return;
        }

        // const username = localStorage.getItem('username');
        // const usernameElement = document.getElementById("username");
        // if (usernameElement) {
        //     usernameElement.textContent = username;
        // }

        const stars = document.querySelectorAll('.star');
        const ratingInput = document.getElementById('rating');

        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = e.target.dataset.rating;
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
            const formData = new FormData(form);
            const rating = formData.get('rating');
            const review = formData.get('review');

            if (!rating) {
                showMessage('alertContainer', 'Please select a star rating', 'error');
                return;
            }

            const reviewData = {
                book_id: this.bookId,
                rating: parseInt(rating),
                review: review || ""
            };
            
            try {
                const response = await fetchToken('http://localhost:8080/api/reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reviewData)
                });

                if (response.ok) {
                    window.history.pushState(null, null, '/reviews');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                } else {
                    const data = await response.json();
                    // console.error("Error:", error);
                    showMessage('alertContainer', data?.error || 'Failed to create review', 'error');
                }
            } catch (error) {
                // console.error('Error:', error);
                showMessage('alertContainer', 'An error occurred while creating the review.', 'error');
            }
        });
    }
}

export default NewReview;
