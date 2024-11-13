export default class {
    constructor(params) {
        this.params = params;
    }

    // This will change the title of the page
    setTitle(title) {
        document.title = title;
        this.title = title;
    }

    async getHtml() {
        return "";
    }
}