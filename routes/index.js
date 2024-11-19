import home from "../static/javascript/views/home.js";
import books from "../static/javascript/views/books/books.js";
import searchBook from "../static/javascript/views/books/searchBook.js";
import editBook from "../static/javascript/views/books/editBook.js";
import newBook from "../static/javascript/views/books/newBook.js";
import showBook from "../static/javascript/views/books/showBook.js";
import deleteBook from "../static/javascript/views/books/deleteBook.js";

import reviews from "../static/javascript/views/reviews/reviews.js";
import newReview from "../static/javascript/views/reviews/newReview.js";
import showReviews from "../static/javascript/views/reviews/showReviews.js";
import singleReview from "../static/javascript/views/reviews/singleReview.js";
import editReview from "../static/javascript/views/reviews/editReview.js";
import deleteReview from "../static/javascript/views/reviews/deleteReview.js";


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


const homeRoutes = [
    { path: '/', view: home },
];

const bookRoutes = [
    { path: '/books', view: books },
    { path: '/books/search', view: searchBook },
    { path: '/books/new', view: newBook },
    { path: '/books/edit/:id', view: editBook },
    { path: '/books/delete/:id', view: deleteBook },
    { path: '/books/:id', view: showBook }
];

const reviewRoutes = [
    { path: '/reviews', view: reviews },
    { path: '/reviews/new/:bookId', view: newReview },
    { path: '/reviews/book/:bookId', view: showReviews },
    { path: '/reviews/edit/:reviewId', view: editReview },
    { path: '/reviews/delete/:reviewId', view: deleteReview },
    { path: '/reviews/:reviewId', view: singleReview},
];

const router = async () => {
    const routes = [
        ...homeRoutes,
        ...bookRoutes,
        ...reviewRoutes
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
    if (view.afterRender) {
        await view.afterRender();
    }
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