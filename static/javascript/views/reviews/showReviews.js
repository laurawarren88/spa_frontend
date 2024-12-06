import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Book Reviews");
        this.bookId = params.bookId;
    }

    async getHtml() {
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/book/${this.bookId}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch reviews for book: ${response.status}`);
            }

            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;

            const data = await response.json();
            const bookTitle = data.bookTitle;

            const reviews = data.reviews ?? [];
            if (reviews.length === 0) {
                return `
                    <section class="max-w-3xl mx-auto bg-softWhite">
                        <div class="flex flex-col items-center justify-center mx-auto md:h-screen lg:py-0">
                            <div class="w-full bg-white border border-gold">
                                <div class="">
                                    <h1 class="text-xl font-bold font-playfair text-slateGray text-center">Reviews for: <span class="font-extrabold italic">${bookTitle || 'Unknown Book'}</span></h1>
                                    <p class="font-lora text-center">No reviews yet for this book.</p>
                                </div>
                                <div class="flex justify-center m-6">
                                    ${token ? `<a href="/reviews/new/${this.bookId}" class="btn-primary" data-link>Add Your Review</a>` : ''}
                                </div>
                            </div>
                        </div>
                    </section>
                `;
            }

            const bookImage = data.reviews[0]?.book?.image;
            const bookAuthor = data.reviews[0]?.book?.author;
            const averageRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

            return `
                <!-- Hero Section -->
                    <section class="relative h-screen">
                        <img class="absolute w-full h-full object-cover" src="data:image/jpeg;base64,${bookImage}" alt="${bookTitle}"">
                    </section>

                <!-- Heading Section -->
                    <section class="max-w-7xl mx-auto">
                        <div class="title-section">
                            <h1 class="h1-primary">Reviews for ${bookTitle}</h1>
                            <p class="font-lora mb-2 text-slate-700 leading-normal font-light italic">${bookAuthor}</p>
                             <div class="flex justify-center mt-4">
                                <span class="font-lora mr-3">Average Rating:</span>
                                <div class="rating">${'★'.repeat(Math.round(averageRating))}${'☆'.repeat(5 - Math.round(averageRating))}</div>
                            </div>
                        </div>
                    </section>

                <!-- Button Section -->
                    <section class="max-w-7xl mx-auto mt-8">
                        <div class="flex justify-center w-auto">
                            ${token ? `<a href="/reviews/new/${this.bookId}" class="btn-primary" data-link>Add Your Review</a>` : ''}
                        </div>
                    </section>


                <!-- Reviews Section -->
                    <div class="max-w-7xl mx-auto">
                        ${this.renderReviews(reviews)}
                    </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            return  ` 
                <section class="message-container">
                    <div class="message-layout">
                        <h1 class="message-title">Error loading reviews</h1>
                        <p class="message-text">Please try again</p>
                    </div>
                </section>
            `;
        }
    }

    renderReviews(reviews) {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
        const isAdmin = payload?.isAdmin || false;

        return reviews.length ? `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        ${reviews.map(review => `
            <div class="review-card h-fit">
                <div class="review-content">
                    <div class="rating mb-2">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                    </div>
                    <p class="text-sm text-gray-600 mb-2">Review by: ${review.username}</p>
                    <span class="text-xs text-gray-500">
                        ${(() => {
                            const dateStr = review.created_at || '1970-01-01T00:00:00Z';
                            // console.log('Review Created At:', review.created_at);

                            if (!dateStr) return 'Date not available'; // Handle missing dates

                            try {
                                const parsedDate = new Date(dateStr);

                                if (isNaN(parsedDate.getTime())) return 'Invalid date'; // Handle invalid dates

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
                </div>

                <p class="review-text mt-3 line-clamp-3">${review.review}</p>

                <div class="flex flex-col mt-4 gap-5">
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
        `).join('')}
         </div>
        ` : ` 
            <section class="message-container">
                <div class="message-layout">
                    <h1 class="message-title">No reviews yet for this book.</h1>
                    <p class="message-text">Please try again later or add your own</p>
                </div>
            </section>
        `;
    }
}

