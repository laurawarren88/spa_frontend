import boilerplate from "../boilerplate.js";
import { fetchToken } from "../../../../utils/fetchToken.js";

class DeleteReview extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Delete Review");
        this.reviewId = params.reviewId;
    }

    async getHtml() {
        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1];

            const response = await fetchToken(`http://localhost:8080/api/reviews/${this.reviewId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const review = await response.json();

            return `
                <div class="delete-confirmation">
                    <h1>Delete Review</h1>
                    <div class="review-content">
                        <p>Are you sure you want to delete this review?</p>
                        <blockquote>${review.review}</blockquote>
                        <p>Rating: ${review.rating}/5</p>
                    </div>
                    <div class="action-buttons">
                        <button type="button" id="confirmDelete">Confirm Delete</button>
                        <a href="/reviews" data-link>Cancel</a>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            return '<h1>Failed to load review details</h1>';
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

                 // Change this line
                const response = await fetchToken(`http://localhost:8080/api/reviews/delete/${this.reviewId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    },
                })
  

                    console.log('Sending delete request for review:', this.reviewId);


                    if (response.ok) {
                        console.log('Review deleted successfully');
                        window.history.pushState(null, null, '/reviews');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                    } else {
                        throw new Error('Failed to delete review', response.status);
                    }
                } catch (error) {
                    console.error('Delete error:', error);
                    alert('Failed to delete review');
                }
            });
        }
    }
}

export default DeleteReview;
