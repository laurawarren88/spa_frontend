import boilerplate from "./boilerplate.js";
import { fetchToken } from "../../../utils/fetchToken.js";

class Profile extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Profile");
        this.userId = params.id || localStorage.getItem('userId'); 
    }

    async getHtml() {
        try {
            const response = await fetchToken(`http://localhost:8080/api/profile/${this.userId}`)

            const user = await response.json();
            console.log("User Data:", user);

            const isAdminUser = user && user.isAdmin === true;
            
            if (isAdminUser) {
                return `
                 <section class="bg-softWhite min-h-screen py-20">
                    <div class="max-w-7xl mx-auto px-4">

                        <!-- Heading Section -->
                        <div class="title-section mb-16">
                            <h1 class="h1-primary">Admin Dashboard</h1>
                            <p class="font-playfair text-2xl text-slate-600 mt-4">Welcome, ${user.username}</p>
                        </div>

                         <!-- Admin Controls -->
                        <div class="bg-white rounded-lg shadow-lg p-8 border border-gold/20">
                            <h2 class="font-playfair text-2xl text-slate-800 mb-8 pb-4 border-b border-gold/30">Admin Controls</h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <a href="/" class="btn-primary text-center" data-link>Home Page</a>
                                <a href="/books/new" class="btn-secondary text-center" data-link>Add a new book</a>
                                <a href="/books" class="btn-secondary text-center" data-link>Manage Books</a>
                                <a href="/reviews" class="btn-secondary text-center" data-link>Manage Reviews</a>
                            </div>
                        </div>
                    </div>
                </section>
                `;
            } else {
                return `
                    <section class="bg-softWhite min-h-screen py-20">
                    <div class="max-w-7xl mx-auto px-4">
                        <!-- Heading Section -->
                        <div class="title-section mb-16">
                            <h1 class="h1-primary">Your Reading Journey</h1>
                            <p class="font-playfair text-2xl text-slate-600 mt-4">Welcome, ${user.username}</p>
                        </div>

                        <!-- User Controls -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="bg-white rounded-lg shadow-lg p-8 border border-gold/20">
                                <h2 class="font-playfair text-xl text-slate-800 mb-4">Quick Actions</h2>
                                <a href="/" class="btn-primary block text-center mb-4" data-link>Home Page</a>
                                <a href="/reviews" class="btn-secondary block text-center mb-4" data-link>Leave a review</a>
                            </div>

                            <div class="bg-white rounded-lg shadow-lg p-8 border border-gold/20">
                                <h2 class="font-playfair text-xl text-slate-800 mb-4">Discover Books</h2>
                                <p class="font-lora text-slate-600 mb-4">Let's find your next literary adventure!</p>
                                <a href="/books" class="btn-secondary block text-center mb-4" data-link>Browse All Books</a>
                            </div>

                            <div class="bg-white rounded-lg shadow-lg p-8 border border-gold/20 md:col-span-2">
                                <h2 class="font-playfair text-xl text-slate-800 mb-4">Looking for Something Specific?</h2>
                                <p class="font-lora text-slate-600 mb-4">Use our search feature to find exactly what you want.</p>
                                <a href="/books/search" class="btn-secondary block text-center" data-link>Search for a book</a>
                            </div>
                        </div>
                    </div>
                </section>
                `;
            }
        } catch (error) {
            return `
            <section class="message-container">
                <div class="message-layout">
                    <h1 class="message-title">Error loading profile</h1>
                    <p class="message-text">Please try again</p>
                </div>
            </section>
            `;
        }
    }
}
export default Profile;
