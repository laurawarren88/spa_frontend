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
            const reviews = data.reviews || [];

            const randomReviews = reviews
            .sort(() => Math.random() - 0.5)
            .slice(0, 12);

            const reviewsHtml = randomReviews.length > 0 ? `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            ${reviews.map(review => `
                <div class="review-card">
                    <div class="review-content flex-grow">
                        <h3 class="review-title">${review.book.title}</h3>
                        <p class="font-lora mb-2 text-slate-700 leading-normal font-light italic">${review.book.author}</p>
                        <div class="rating mb-2">
                            ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                        </div>
                        <p class="text-sm text-gray-600">Reviewed by: ${review.username}</p>
                        <span class="text-xs text-gray-500">
                            ${(() => {
                                const dateStr = review.created_at || '1970-01-01T00:00:00Z';
                                console.log('Review Created At:', review.created_at);

                                if (!dateStr) return 'Date not available'; // Handle missing dates

                                try {
                                    const parsedDate = new Date(dateStr);

                                    if (isNaN(parsedDate.getTime())) return 'Invalid date'; 

                                    const day = String(parsedDate.getDate()).padStart(2, '0');
                                    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
                                    const year = parsedDate.getFullYear();

                                    return `${day}.${month}.${year}`;
                                } catch (err) {
                                    console.error('Date parsing error:', err);
                                    return 'Date not available';
                                }
                            })()}
                        </span>

                        <p class="review-text mt-3 line-clamp-3">${review.review}</p>
                    
                        <div class="flex flex-col mt-4 gap-5">
                            <div>
                                <a href="/reviews/book/${review.book.id}" class="btn-primary inline-block w-full text-center" data-link>View all reviews for this book</a>
                            </div>
                            <div>
                                <a href="/reviews/${review.id}" class="btn-secondary inline-block w-full text-center" data-link>Expand this review</a>
                            </div>
                            <div class="flex justify-center">
                                ${isAdmin ? `
                                    <a href="/reviews/edit/${review.id}" class="link mr-3" data-link>Edit</a>
                                    <a href="/reviews/delete/${review.id}" class="link" data-link>Delete</a>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
            </div>
            ` : `
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
                    </div>
                </section>

            
            <!-- Heading Section -->
                <section class="max-w-7xl mx-auto">
                    <div class="title-section">
                        <h1 class="h1-primary">Reviews</h1>
                    </div>
                </section>

                <div class="max-w-7xl mx-auto">
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
