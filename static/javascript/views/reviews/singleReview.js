import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Review Details");
        this.reviewId = params.reviewId;
    }

    async getHtml() {
        try {
            // console.log('Fetching review with ID:', this.reviewId);
    
            // if (!this.reviewId) {
            //     throw new Error('Review ID is required');
            // }
    
            const response = await fetch(`http://localhost:8080/api/reviews/${this.reviewId}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch review ${response.status}`);
            }

            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
            const isAdmin = payload?.isAdmin || false;
    
            const review = await response.json();
            // console.log('Fetched data:', review);
    
            return `
                <div class="">
                    <h1 class="">Review for ${review.book.title}</h1>
                    <div class="">
                        <span>Rating: </span>
                        <div class="">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                    </div>
                    <div class="">
                        <p>${review.review}</p>
                    </div>
                    <div class="">
                        <span class="">Posted on: ${new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="review-actions">                        
                        <a href="/reviews/book/${review.book.id}" data-link>Back to Book Reviews</a>
                        ${isAdmin ? `<a href="/reviews/edit/${review.id}" data-link>Edit Review</a>` : ''}
                        ${isAdmin ? `<a href="/reviews/delete/${review.id}" data-link>Delete</a>` : ''}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            return '<h1>Failed to load review details</h1>';
        }
    }
}    