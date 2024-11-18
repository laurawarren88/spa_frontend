import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Reviews");
        this.bookId = params.bookId;
    }

    async getHtml() {
        try {
            const response = await fetch(`http://localhost:8080/api/reviews`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched data:', data);
            const reviews = data.reviews || [];
            console.log('Fetched review:', reviews);

            const reviewsHtml = reviews.length > 0 ? reviews.map(review => `
                <div class="">
                    <div class="">
                    <p>${review.book.title}</p>
                        <div class="">
                            ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                        </div>
                    </div>
                    <p class="">${review.review}</p>
                    <div class="">
                        <span class="">${new Date(review.created_at).toLocaleDateString()}</span>
                        <div class="">
                            <a href="/reviews/book/${review.book.id}" data-link>View all reviews for this book</a>
                            <a href="/reviews/${review.id}" data-link>Expand this review</a>
                            <a href="/reviews/edit/${review.id}" data-link>Edit</a>
                            <a href="/reviews/delete/${review.id}" data-link>Delete</a>
                        </div>
                    </div>
                </div>
            `).join('') : '<p>No reviews yet.</p>';

            return `
                <h1 class="">Reviews</h1>
                <div class="">
                    ${reviewsHtml}
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            return '<h1>Error loading reviews</h1>';
        }
    }
}
