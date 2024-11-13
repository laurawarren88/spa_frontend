import boilerplate from "./boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Home");
    }

    async getHtml() {
        return `
            <section class="">
                <div class="">
                    <h2>Have your say!</h2>
                </div>
            </section>

            <section class="">
                <div class="">
                    <h2 class="">Search for a book</h2>  
                    <form  action="/" method="get"  class="">
                        <div class="">
                            <input type="text" name="title" id="" value="" placeholder="Search for a book by title" required>
                            <button type="search" value="go" id="">Search</button>
                        </div>
                        <div class="">
                            <a href="/books/search" data-link>Search for a book</a>
                        </div>
                    </form>
                </div>
                </section>  

                <h1 class="">Book Reviews</h1>
        `;
    }
}