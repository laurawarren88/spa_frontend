import boilerplate from "../boilerplate.js"

export default class extends boilerplate {
    constructor (params) {
        super(params);
        this.setTitle("Register");
    }

async getHtml() {
    return ` 
        <section>
            <div class="">
                <h3 class="">Register</h3>
                <form id="newUserForm" class="" onsubmit="return false">
                    <label class="" for="username">Username</label>
                    <input type="text" name="username" placeholder="Username" required><br>

                    <label class="" for="email">Email Address</label>
                    <input type="email" name="email" placeholder="Email" required><br>

                    <label class="" for="password">Password</label>
                    <input type="password" name="password" placeholder="Password" required><br>

                    <label class="" for="confirm_password">Confirm Password</label>
                    <input type="password" name="confirm_password" required><br>
                    <div>
                        <a href="/user/login" class="" data-link>Already have an account?</a>
                        <a href="/user/forgot_password" class="" data-link>Forgot Password?</a>
                    </div>
                    <button type="submit" id="submit">Sign Up</button>

                    <a href="/" data-link>Home</a>
                </form>
            </div>
        </section>
    `;
}

async afterRender() {
    const form = document.getElementById('newUserForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const payload = {
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirm_password: formData.get("confirm_password"),
        };
        try {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log("User registered successfully!");
                window.history.pushState(null, null, '/users/login');
                window.dispatchEvent(new PopStateEvent('popstate'));
            } else {
                const errorResponse = await response.json();
                console.error("Error:", error);
                alert(errorResponse?.error || 'Failed to create an account');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while creating the account.');
        }
    });
}
}