import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Delete Review");
        this.reviewId = params.reviewId;
    }
    
    async getHtml() {
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/delete/${this.reviewId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                window.history.pushState(null, null, '/reviews');
                window.dispatchEvent(new PopStateEvent('popstate'));
                return '';
            } else {
                throw new Error('Failed to delete review');
            }
        } catch (error) {
            console.error('Delete error:', error);
            return '<h1>Failed to delete review</h1>';
        }
    }
}