import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Search Books");
    }

    async getHtml() {
        return `
            <h1 class="main_heading">Advanced Search Options </h1>

            <section class="">
            <div class="">
                <h2 class="">Search for a book</h2>  
                <form action="/books/advancedSearch" method="get" class="">
                    <input type="text" name="title" id="" value="" placeholder="Title">
                    <p class="">and/or</p>
                    <input type="text" name="author" id="" value="" placeholder="Author">
                    <p class="">and/or</p>
                    <input type="text" name="category" id="" value="" placeholder="Category">
                    <button type="search" value="go" id="">Search</button>
                    <a href="/books" data-link><< Back</a>
                </form>
            </div>
            </section>
        `;
    }
}