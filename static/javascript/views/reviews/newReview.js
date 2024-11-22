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
                <h1 class="">Review for ${bookData.title}</h1>
                <form id="reviewForm" class="">
                    <div class="">
                        <label for="rating">Rating:</label>
                        <div class="">
                            ${[1,2,3,4,5].map(num => `
                                <input type="radio" id="star${num}" name="rating" value="${num}" required>
                                <label for="star${num}">★</label>
                            `).join('')}
                        </div>
                    </div>
                    <div class="">
                        <label for="review">Your Review:</label>
                        <textarea id="review" name="review" required></textarea>
                    </div>
                    <button type="submit">Submit Review</button>
                </form>
            `;
        } catch (error) {
            console.error('Error:', error);
            return '<h1>Error loading review form</h1>';
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
                    alert(errorResponse?.error || 'Failed to create review');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while creating the review.');
            }
        });
    }
}

export default NewReview;
