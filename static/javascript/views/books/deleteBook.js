import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Delete Book");
        this.bookId = params.id;
    }

    async getHtml() {
        try {
            const response = await fetch(`http://localhost:8080/api/books/delete/${this.bookId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                window.history.pushState(null, null, '/books');
                window.dispatchEvent(new PopStateEvent('popstate'));
                return '';
            } else {
                throw new Error('Failed to delete book');
            }
        } catch (error) {
            console.error('Delete error:', error);
            return '<h1>Failed to delete book</h1>';
        }
    }
}
