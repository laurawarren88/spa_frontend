import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Book Reviews");
        this.bookId = params.bookId;
    }

    async getHtml() {
        try {
            console.log('Fetching book with ID:', this.bookId);

            if (!this.bookId) {
                throw new Error('Book ID is required');
            }

            const response = await fetch(`http://localhost:8080/api/reviews/book/${this.bookId}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch reviews for book: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched data:', data);
            const bookTitle = data.bookTitle;

            const reviews = data.reviews ?? [];
            if (!reviews || reviews.length === 0) {
                return `
                    <div class="">
                        <h1 class="">Reviews for ${bookTitle || 'Unknown Book'}</h1>
                        <p>No reviews yet for this book.</p>
                        <a href="/reviews/new/${this.bookId}" class="" data-link>Add Your Review</a>
                    </div>
                `;
            }

            const averageRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

            return `
                <div class="">
                <h1 class="">Reviews for ${bookTitle}</h1>
                <div class="">
                    <span>Average Rating: ${averageRating.toFixed(1)}</span>
                    <div class="">${'★'.repeat(Math.round(averageRating))}${'☆'.repeat(5 - Math.round(averageRating))}</div>
                </div>
                     <a href="/reviews/new/${this.bookId}" class="" data-link>Add Your Review</a>
                <div class="">
                    ${this.renderReviews(reviews)}
                </div>
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            return '<h1>Error loading reviews</h1>';
        }
    }

    renderReviews(reviews) {
        return reviews.length ? reviews.map(review => `
            <div class="">
                <div class="">
                    <div class="">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                    <span class="">${new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p class="">${review.review}</p>
                    <a href="/reviews/${review.id}" data-link>Expand this review</a>
                    <a href="/reviews/edit/${review.id}" data-link>Edit</a>
                    <a href="/reviews/delete/${review.id}" data-link>Delete</a>
            </div>
        `).join('') : '<p>No reviews yet for this book.</p>';
    }
}

