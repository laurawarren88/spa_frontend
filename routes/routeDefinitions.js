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

import { requireAuth } from "../utils/authCheck.js"
import { requireAdmin } from "../utils/adminCheck.js"

export const homeRoutes = [
    { path: '/', view: home },
    { path: '/profile', view: requireAuth(profile) },
];

export const bookRoutes = [
    { path: '/books', view: books },
    { path: '/books/search', view: searchBook },
    { path: '/books/new', view: requireAuth(requireAdmin(newBook)) },
    { path: '/books/edit/:id', view: requireAuth(requireAdmin(editBook)) },
    { path: '/books/delete/:id', view: requireAuth(requireAdmin(deleteBook)) },
    { path: '/books/:id', view: showBook }
];

export const reviewRoutes = [
    { path: '/reviews', view: reviews },
    { path: '/reviews/new/:bookId', view: requireAuth(newReview) },
    { path: '/reviews/book/:bookId', view: showReviews },
    { path: '/reviews/edit/:reviewId', view: requireAuth(requireAdmin(editReview)) },
    { path: '/reviews/delete/:reviewId', view: requireAuth(requireAdmin(deleteReview)) },
    { path: '/reviews/:reviewId', view: singleReview},
];

export const userRoutes = [
    { path: '/users/login', view: login },
    { path: '/users/register', view: register },
    { path: '/users/forgot_password', view: forgotPassword },
    { path: '/users/logout', view: requireAuth(logout) },
];