import boilerplate from "../boilerplate.js";
import { fetchToken } from "../../../../utils/fetchToken.js";

class EditReview extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Edit Review");
        this.reviewId = params.reviewId;
    }

async getHtml() {
    try {
        const response = await fetchToken(`http://localhost:8080/api/reviews/edit/${this.reviewId}`);

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

        return `
            <section class="bg-softWhite py-8 mt-20">
            
            <!-- Alert container -->
            <div id="alertContainer" class="hidden"></div>

                <div class="max-w-3xl mx-auto px-4">
                    <div class="bg-white rounded-lg shadow-lg p-6 border border-gold">

                    <h1 class="form-title items-center mb-6">Edit review details</h1>
            
                        <form id="editReviewForm" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-6">
                                    <textarea name="review" class="form-input min-h-[150px] resize-y" required>${review.review}</textarea>
                                    <select name="rating" required>
                                        ${[1,2,3,4,5].map(num => `
                                            <option value="${num}" ${review.rating === num ? 'selected' : ''}>${num}</option>
                                        `).join('')}
                                    </select>
                                </div>
                            <div>
                            <div class="flex flex-col mt-auto gap-3">
                                <div class="flex flex-row justify-start items-center gap-4">
                                    <button type="submit" id="submit" class="btn-primary w-24 text-center">Update</button>
                                    <a href="/reviews" class="link w-24 text-center" data-link>Cancel</a>
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
        
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const formData = new FormData(form);
            const reviewData = {
                rating: parseInt(formData.get('rating')),
                review: formData.get('review')
            };

            try {
                const response = await fetchToken(`http://localhost:8080/api/reviews/edit/${this.reviewId}`, {
                    method: 'PUT',
                    // headers: {
                    //     'Content-Type': 'application/json'
                    // },
                    body: JSON.stringify(reviewData)
                });

                if (response.ok) {
                    window.history.pushState(null, null, `/reviews/${this.reviewId}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                } else {
                    throw new Error('Failed to update review');
                }
            } catch (error) {
                console.error('Update failed:', error);
                showMessage('alertContainer', 'Failed to update review', 'error');
            }
        });
    }
}

export default EditReview;
