import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Book Details");
        this.bookId = params.id;
    }

    async getHtml() {
        // const response = await fetch(`http://localhost:8080/books/${this.bookId}`);
        const response = await fetch('/books/${this.bookId}');
        const book = await response.json();

        return `
            <h1>Show Book Page</h1>
            <div>
                <h2>${ book.title }</h2>
                <p>${ book.author }</p>
                <p>${ book.category }</p>
                <p>${ book.description }</p>
            </div>
            
            <a href="/books/edit/${this.bookId}" data-link>Edit</a>
            <a href="/books/delete/${this.bookId}" data-link>Delete</a>
            <a href="" data-link>Leave a Review</a>
        `;
    }
}