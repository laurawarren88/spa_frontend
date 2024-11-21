import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Login");
        this.userId = params.userId;
    }

async getHtml() {
    try {
        const userResponse = await fetch(`http://localhost:8080/api/users/login`);
        const responseData = await userResponse.json();

        const userData = responseData.user;

        if (!userData) {
            console.error("User data is missing:", responseData);
            throw new Error("Failed to fetch user data");
    }
    return `
        <section>
            <div class="">
                <h3 class="">Forgot Password?</h3>
                <form id="forgotPasswordForm" class="" onsubmit="return false">
                    <label class="" for="email">Email Address</label>
                    <input type="text" id="email" name="email" required><br>
                    <button type="submit" id="submit">Reset Password</button>
                    <a href="/" data-link>Home</a>
                </form>
            </div>
        </section>
    `;
    } catch (error) {
        console.error('Error:', error);
        return '<h1>Error loading login form</h1>';
    }
}

    async afterRender() {
        const form = document.getElementById('forgotPasswordForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            try {
                const response = await fetch('http://localhost:8080/api/users/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: formData
                });

                if (response.ok) {
                    window.history.pushState(null, null, '/');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                } else {
                    const errorResponse = await response.json();
                    alert(errorResponse?.error || 'Failed to reset password');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while resetting password.');
            }
        });
    }
}