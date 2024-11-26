import boilerplate from "./boilerplate.js";
import { fetchToken } from "../../../utils/fetchToken.js";

class Profile extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Profile");
        this.userID = params.id;
    }

    async getHtml() {
        try {
            const response = await fetch(`http://localhost:8080/api/profile`, {
                headers: {
                    'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]}`
                },
                credentials: 'include'
            });

            const user = await response.json();
            console.log("User Data:", user);

            const isAdminUser = user && user.isAdmin === true;
            
            if (isAdminUser) {
                return `
                    <h1>Admin Dashboard - Welcome, ${user.username}</h1>
                    <section>
                        <h2>Admin Controls</h2>
                            <div id="">
                                <a href="/" data-link>Home Page</a>
                                <a href="/books/new" data-link>Add a new book</a>
                                <a href="/books" data-link>Manage Books</a>
                                <a href="/reviews" data-link>Manage Reviews</a>
                            </div>
                    </section>
                `;
            } else {
                return `
                    <h1>Welcome, ${user.username}</h1>
                    <section>
                        <div id="">
                             <a href="/" data-link>Home Page</a>

                            <p>Lets get started at looking for your next book!!!!</p>
                            <a href="/books" data-link>Browse All Books</a>
                            
                            <p>Or if you know what you want...</p>
                            <a href="/books/search" data-link>Search for a book</a>
                        </div>
                    </section>
                `;
            }
        } catch (error) {
            return '<h1>Error loading profile. Please try again.</h1>';
        }
    }
}

export default Profile;
