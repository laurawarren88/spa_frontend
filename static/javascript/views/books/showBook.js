import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Book Details");
        console.log('Params received:', params);
        this.bookId = params.id;
    }

    async getHtml() {
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/book/${this.params.id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            const reviews = data.reviews || [];
            console.log('Fetched reviews:', reviews);
    
            const reviewsHtml = reviews.length > 0
                ? reviews.map(review => `
                    <div class="review-card">
                        <h3>${review.bookTitle}</h3>
                        <p>${review.review}</p>
                    </div>
                `).join('')
                : '<p>No reviews found for this book.</p>';
    
            return `
                <h1>Reviews for Book</h1>
                <div>${reviewsHtml}</div>
            `;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return '<h1>Error loading reviews</h1>';
        }
    }
}