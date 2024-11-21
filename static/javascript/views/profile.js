import boilerplate from "./boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Profile");
        this.userID = params.id;
    }

    async getHtml() {
        try {
            // console.log("Profile Cookie:", document.cookie)

            const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
    
            if (!token) {
                console.error('Token not found in cookies.');
                alert('Please login to update the book.');
                return;
            }

            // console.log('Cookie:', token);

            if (!token) {
                console.error('Token not found in cookies.');
                return '<h1>Please login to view your profile</h1>';
            }
    
            const response = await fetch(`http://localhost:8080/api/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }
    
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