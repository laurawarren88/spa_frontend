import boilerplate from "../boilerplate.js"
import { showMessage } from "../../../../utils/messageAlert.js";

export default class extends boilerplate {
    constructor (params) {
        super(params);
        this.setTitle("Register");
    }

async getHtml() {
    return ` 
        <section class="bg-softWhite">

            <!-- Alert container -->
            <div id="alertContainer" class="hidden"></div>

            <div class="flex flex-col items-center justify-center mx-auto md:h-screen lg:py-0">
            
            <!-- Form Container -->
            <div class="form-container">
                <div class="form-layout">
                    <h1 class="form-title">Register</h1>
                    
                    <form id="newUserForm" class="space-y-4 md:space-y-6">
                        <div>
                            <label class="form-label" for="username">Username</label>
                            <input type="text" name="username" class="form-input" placeholder="Username" required>
                        </div>
                        <div>
                            <label class="form-label" for="email">Email Address</label>
                            <input type="email" name="email" class="form-input" placeholder="Email" required>
                        </div>
                        <div>
                            <label class="form-label" for="password">Password</label>
                            <input type="password" name="password" class="form-input" placeholder="Password" required>
                        </div>
                        <div>
                            <label class="form-label" for="confirm_password">Confirm Password</label>
                            <input type="password" name="confirm_password" class="form-input" required>
                        </div>
                        <div class="flex items-center justify-between">
                            <a href="/users/login" class="link" data-link>Already have an account?</a>
                            <a href="/users/forgot_password" class="link" data-link>Forgot Password?</a>
                        </div>

                        <button type="submit" id="submit" class="btn-primary w-full">Sign Up</button>

                        <div class="flex items-center justify-center">
                            <a href="/" class="link text-center" data-link>Home</a>
                        </div>
                    </form>
                </div>
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
                    // console.log("User registered successfully!");
                    window.history.pushState(null, null, '/users/login');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                } else {
                    const data = await response.json();
                    // console.error("Error:", error);
                    showMessage('alertContainer', data?.error || 'Failed to create an account', 'error');
                }
            } catch (error) {
                // console.error('Error:', error);
                showMessage('alertContainer', 'An error occurred while creating the account', 'error');
            }
        });
    }
}