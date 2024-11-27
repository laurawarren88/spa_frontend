import boilerplate from "../boilerplate.js";
import { showMessage } from "../../../../utils/messageAlert.js";
import { updateNavigation } from "../../../../utils/resNav.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Login");
        this.userId = params.userId;
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
                        <h1 class="form-title">Sign in to your account</h1>
            
                        <form id="loginForm" class="space-y-4 md:space-y-6">
                            <div>
                                <label class="form-label" for="email">Email</label>
                                <input type="email" name="email" class="form-input" placeholder="name@company.com" required>
                            </div>

                            <div>
                                <label class="form-label" for="password">Password</label>
                                <input type="password" name="password" class="form-input" placeholder="••••••••" required>
                            </div>

                            <div class="flex items-center justify-between">
                                <a href="/users/forgot_password" class="link" data-link>Forgot password?</a>
                            </div>

                            <button type="submit" id="submit" class="btn-primary w-full">Sign in</button>

                            <p class="font-lora text-sm text-slateGray">Don't have an account yet?<a href="/users/register" class="link" data-link> Sign up</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    `;
} 

    async afterRender() {
        const form = document.getElementById('loginForm');
        if (!form) {
            console.error('Login form not found.');
            return;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            // const jsonData = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('http://localhost:8080/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.get('email'),
                        password: formData.get('password'),
                    }),
                    credentials: 'include',
                })

                // .then (console.log(document.cookie))
                // console.log("Cookie:", document.cookie);

                // const data = await response.json();
                // console.log("Login Data:", data)
                
                if (response.ok) {
                    updateNavigation(true);
                    window.history.pushState(null, null, '/profile');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                } else {
                    const data = await response.json();
                    // console.error("Error:", error);
                    showMessage('alertContainer', data?.error || 'Failed to login', 'error');
                }
            } catch (error) {
                // console.error('Error:', error);
                showMessage('alertContainer', 'An error occurred while logging in', 'error');
            }
        });
    }
}
