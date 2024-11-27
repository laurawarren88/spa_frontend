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
            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
            const isAdmin = payload?.isAdmin || false;

            const data = await response.json();
            // console.log('Fetched data:', data);
            const reviews = data.reviews || [];
            // console.log('Fetched review:', reviews);

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
                            ${isAdmin ? `<a href="/reviews/edit/${review.id}" data-link>Edit</a>` : ''}
                            ${isAdmin ? `<a href="/reviews/delete/${review.id}" data-link>Delete</a>` : ''}
                        </div>
                    </div>
                </div>
            `).join('') : `
                <section class="message-container">
                    <div class="message-layout">
                        <h1 class="message-title">No reviews yet</h1>
                        <p class="message-text">Please add a review</p>
                    </div>
                </section>
            `;
            return `
            <!-- Hero Section -->
                <section class="relative h-screen">
                    <img class="absolute w-full h-full object-cover" src="/static/images/bookglasses.jpg" alt="Book">
                    <div class="relative max-w-7xl mx-auto h-full">
                        <div class="absolute top-1/3 right-4">
                            <div class="bg-white/75 p-6 rounded-lg relative before:absolute before:right-4 before:-bottom-3 before:w-4 before:h-4 before:bg-white/75 before:rotate-45">
                                <h3 class="text-3xl text-slate-500">See what others have said</h3>
                            </div>
                        </div>
                    </div>
                </section>

            
            <!-- Heading Section -->
                <section class="max-w-7xl mx-auto">
                    <div class="title-section">
                        <h1 class="h1-primary">Reviews</h1>
                    </div>
                </section>

                <div class="">
                    ${reviewsHtml}
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            return `
                <section class="message-container">
                    <div class="message-layout">
                        <h1 class="message-title">Error loading reviews</h1>
                        <p class="message-text">Please try again</p>
                    </div>
                </section>
            `;
        }
    }
}
