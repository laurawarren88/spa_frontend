import home from "../static/javascript/views/home.js";
import books from "../static/javascript/views/books/books.js";
import searchBook from "../static/javascript/views/books/searchBook.js";
import editBook from "../static/javascript/views/books/editBook.js";
import newBook from "../static/javascript/views/books/newBook.js";
import showBook from "../static/javascript/views/books/showBook.js";
// import deleteBook from "../static/js/views/books/deleteBook.js";


const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: '/', view: home },
        { path: '/books', view: books },
        { path: '/books/search', view: searchBook },
        { path: '/books/new', view: newBook },
        { path: '/books/:id', view: showBook },
        { path: '/books/edit/:id', view: editBook },
        // { path: '/books/delete/:id', view: deleteBook },
    ];

const potentialMatches = routes.map(route => {
    return {
        route: route,
        result: location.pathname.match(pathToRegex(route.path))
    };
});

let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

if (!match) {
    match = {
        route: routes[0],
        result: [location.pathname]
    };
};

const view = new match.route.view(getParams(match));

const app = document.querySelector('#app');
app.innerHTML = await view.getHtml();

};

window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', e => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
    router();
});

export default router;