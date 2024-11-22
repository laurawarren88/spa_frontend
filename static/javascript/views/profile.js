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
            const response = await fetchToken(`http://localhost:8080/api/profile`, {
                method: 'GET',
            });
    
            if (!response.ok) {
                return '<h1>Please login to view your profile</h1>';
                // throw new Error('Failed to fetch profile');
            }

             // console.log('Cookie:', token);
    
            const user = await response.json();

            return `
                <h1>Profile</h1>
                <section>
                    <div id="profileContainer">
                        <p>Welcome, ${user.username}</p>
                        <p>Email: ${user.email}</p>
                    </div>
                </section>
            `;
        } catch (error) {
            console.error('Error fetching profile:', error);
            return '<h1>Failed to load profile. Please try again later.</h1>';
        }
    }
}

export default Profile;