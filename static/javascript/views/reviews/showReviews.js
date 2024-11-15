import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.bookId = params.bookId;
    }

    async getHtml() {
        try {
            const reviewsResponse = await fetch(`http://localhost:8080/api/reviews/book/${this.bookId}`);

            const bookData = await bookResponse.json();
            const reviewsData = await reviewsResponse.json();

            const averageRating = reviewsData.reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviewsData.reviews.length;

            return `
                <div class="book-reviews">
                    <h1 class="main_heading">Reviews for ${bookData.title}</h1>
                    <div class="average-rating">
                        <span>Average Rating: ${averageRating.toFixed(1)}</span>
                        <div class="stars">${'★'.repeat(Math.round(averageRating))}${'☆'.repeat(5-Math.round(averageRating))}</div>
                    </div>
                    <div class="reviews-list">
                        ${this.renderReviews(reviewsData.reviews)}
                    </div>
                    <a href="/reviews/new/${this.bookId}" class="add-review-btn" data-link>Add Your Review</a>
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            return '<h1>Error loading reviews</h1>';
        }
    }

    renderReviews(reviews) {
        return reviews.length ? reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                    <span class="review-date">${new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p class="review-content">${review.review}</p>
            </div>
        `).join('') : '<p>No reviews yet for this book.</p>';
    }
}