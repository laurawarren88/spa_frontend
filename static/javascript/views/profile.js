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
            
            return `
                <h1>Profile</h1>
                <section>
                    <div id="profileContainer">
                        <p>Welcome, ${user.username}</p>
                        <p>Email: ${user.email}</p>
                        ${user.isAdmin ? '<p>Admin Status: Active</p>' : ''}
                    </div>
                </section>
            `;
        } catch (error) {
            return '<h1>Error loading profile. Please try again.</h1>';
        }
    }
}

export default Profile;
