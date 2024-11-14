export default class {
    constructor(params) {
        this.params = params;
    }

    setTitle(title) {
        document.title = title;
        this.title = title;
    }

    async getHtml() {
        return "";
    }
}