import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Add Review");
        this.bookId = params.bookId;
    }

    async getHtml() {
        try {
            const bookResponse = await fetch(`http://localhost:8080/api/books/${this.bookId}`);
            const bookData = await bookResponse.json();

            return `
                <h1 class="main_heading">Review for ${bookData.title}</h1>
                <form id="reviewForm" class="review-form">
                    <div class="form-group">
                        <label for="rating">Rating:</label>
                        <div class="star-rating">
                            ${[1,2,3,4,5].map(num => `
                                <input type="radio" id="star${num}" name="rating" value="${num}">
                                <label for="star${num}">★</label>
                            `).join('')}
                        </div>
                    </div>
                    <div class="form-group">
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
                const response = await fetch('http://localhost:8080/api/reviews', {
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
                    window.location.href = `/books/${this.bookId}`;
                } else {
                    throw new Error('Failed to submit review');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
}
