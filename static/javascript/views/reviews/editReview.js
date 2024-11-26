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
            throw new Error('Failed to fetch review details');
        }

        const review = await response.json();

        return `
            <h1 class="">Edit Review</h1>
            <section class="">
                <div id="reviewsContainer">
                    <form id="editReviewForm" class="">
                        <div>
                            <textarea name="review" required>${review.review}</textarea>
                            <select name="rating" required>
                                ${[1,2,3,4,5].map(num => 
                                    `<option value="${num}" ${review.rating === num ? 'selected' : ''}>${num}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div>
                            <button type="submit" id="submit">Update</button>
                            <a href="/reviews" data-link>Cancel</a>
                        </div>
                    </form>
                </div>
            </section>
        `;
    } catch (error) {
        console.error('Error:', error);
        return '<h1>Failed to load review details</h1>';
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
                alert('Failed to update review');
            }
        });
    }
}

export default EditReview;
