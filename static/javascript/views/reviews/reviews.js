import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Reviews");
    }

    async getHtml() {
        try {
            const reviewsResponse = await fetch(`http://localhost:8080/api/reviews`);
            if (!reviewsResponse.ok) {
                throw new Error(`HTTP error! Status: ${reviewsResponse.status}`);
            }
            const data = await reviewsResponse.json();
            const reviews = data.reviews || [];
            console.log('Fetched review:', data);

            const reviewsHtml = reviews.length > 0 ? reviews.map(review => `
                <div class="review-card">
                    <div class="review-header">
                        <h3>${review.book_title}</h3>
                        <div class="rating">
                            ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                        </div>
                    </div>
                    <p class="review-text">${review.review}</p>
                    <div class="review-footer">
                        <span class="review-date">${new Date(review.created_at).toLocaleDateString()}</span>
                        <div class="review-actions">
                            <a href="/reviews/edit/${review.id}" data-link>Edit</a>
                            <a href="/reviews/delete/${review.id}" data-link>Delete</a>
                        </div>
                    </div>
                </div>
            `).join('') : '<p>No reviews yet.</p>';

            return `
                <h1 class="main_heading">Reviews</h1>
                <div class="reviews-container">
                    ${reviewsHtml}
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            return '<h1>Error loading reviews</h1>';
        }
    }
}
