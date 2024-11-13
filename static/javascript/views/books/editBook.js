import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Edit the Book");
    }

    async getHtml() {
        return `
            <h1 class="">Edit Book</h1>
                
            <section class="">
                <form action="/books/edit/:id" method="PUT" class="">
                    <input type="text" name="title" value="Title" placeholder="Title" required>
                    <input type="text" name="author" value="Author" placeholder="Author" required>
                    <input type="text" name="category" value="Category" placeholder="Category" required>
                    <textarea name="description" placeholder="Breif description of the book" required>Description</textarea>
                    <button type="submit" id="">Update</button>
                    <a href="/books" data-link>Cancel</a>
                </form>
            </section>
        `;
    }
}