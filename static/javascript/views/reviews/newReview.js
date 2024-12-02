import boilerplate from "../boilerplate.js";
import { fetchToken } from "../../../../utils/fetchToken.js";

class NewReview extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Add Review");
        this.bookId = params.bookId;
    }

    async getHtml() {
        try {
            const bookResponse = await fetchToken(`http://localhost:8080/api/reviews/new/${this.bookId}`);
            const responseData = await bookResponse.json();

            const bookData = responseData.book;

            if (!bookData) {
                console.error("Book data is missing:", responseData);
                throw new Error("Failed to fetch book data");
            }

            // ** Uncomment for debugging **
            // console.log('Book Data:', this.params);
            // console.log('Book ID:', this.bookId);
            // console.log('Book Title:', bookData.title);

            return `
            <section class="bg-softWhite py-8 mt-20">
                <div class="max-w-3xl mx-auto px-4">

                <!-- Form Container -->
                    <div class="bg-white rounded-lg shadow-lg p-6 border border-gold">
                       
                        <h1 class="form-title items-center mb-6">Review for ${bookData.title}</h1>

                            <form id="reviewForm" class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-6">
                                        <div>
                                            <label class="form-label" for="rating">Rating:</label>
                                            <div class="rating">
                                                ${[1,2,3,4,5].map(num => `
                                                    <input type="radio" id="star${num}" name="rating" value="${num}" required>
                                                    <label for="star${num}">★</label>
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="space-y-6">
                                        <label class="form-label" for="review">Your Review:</label>
                                        <textarea id="review" name="review" class="form-input min-h-[150px] resize-y"></textarea>
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
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            try {
                const response = await fetchToken('http://localhost:8080/api/reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        book_id: this.bookId,
                        rating: parseInt(formData.get('rating')),
                        review: formData.get('review')
                    })
                });

                if (response.ok) {
                    window.history.pushState(null, null, '/reviews');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                } else {
                    const errorResponse = await response.json();
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
