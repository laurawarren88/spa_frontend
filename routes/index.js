import home from "../static/javascript/views/home.js";
import profile from "../static/javascript/views/profile.js";

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

import login from "../static/javascript/views/users/login.js";
import register from "../static/javascript/views/users/register.js";
import forgotPassword from "../static/javascript/views/users/forgotPassword.js";
import logout from "../static/javascript/views/users/logout.js";

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
    { path: '/profile', view: profile },
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

const userRoutes = [
    { path: '/users/login', view: login },
    { path: '/users/register', view: register },
    { path: '/users/forgot-password', view: forgotPassword },
    { path: '/users/logout', view: logout },
];

const router = async () => {
    const routes = [
        ...homeRoutes,
        ...bookRoutes,
        ...reviewRoutes,
        ...userRoutes,
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