import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Add a New Book");
    }

    async getHtml() {
        return `
            <h1 class="">Add a new book</h1>

            <section class="">
                <div class="">
                    <form action="/books" method="post" class="">
                        <div class="">
                            <input type="text" name="title" placeholder="Title" required>
                            <input type="text" name="author" placeholder="Author" required>
                            <input type="text" name="category" placeholder="Category" required>
                            <textarea name="description" placeholder="Breif description of the book" required></textarea>
                        </div>
                        <div class="">
                            <button type="submit" value="submit">Create</button>
                            <a href="/books" data-link>Cancel</a>
                        </div>
                    </form>
                </div>
            </section>
        `;
    }
}