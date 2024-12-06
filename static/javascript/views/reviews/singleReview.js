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
                <section class="bg-softWhite py-8 mt-20">
                    <!-- <div class="w-full max-w-7xl mx-auto px-4"> -->
                    <div class="w-full flex justify-center px-4 sm:px-6">
                        <div class="bg-white rounded-lg shadow-lg p-6 border border-gold w-auto max-w-7xl">
                    
                            <h1 class="review-title text-center">Review for ${review.book.title}</h1>
                            <div class="rating flex justify-center">
                                ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                            </div>
                            <p class="text-sm text-gray-600 text-center">Review by: ${review.username}</p>

                             <div class="py-4">
                                <p class="font-lora text-justify">${review.review}</p>
                            </div>
                            <div class="flex flex-col mt-auto gap-3">
                                <div class="flex flex-row justify-start items-center gap-4">                      
                                        <a href="/reviews/book/${review.book.id}" class="btn-primary inline-block text-center" data-link>All reviews for this Book</a>
                                        ${isAdmin ? `
                                            <a href="/reviews/edit/${review.id}" class="link w-24 text-center" data-link>Edit Review</a>
                                            <a href="/reviews/delete/${review.id}" class="link w-24 text-center" data-link>Delete</a>
                                        ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `;
        } catch (error) {
            // console.error('Error:', error);
            return ` 
                <section class="message-container">
                    <div class="message-layout">
                        <h1 class="message-title">Failed to load review details</h1>
                        <p class="message-text">Please try again</p>
                    </div>
                </section>
            `;
        }
    }
}    