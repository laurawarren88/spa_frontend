import boilerplate from "../boilerplate.js";
import { showMessage } from "../../../../utils/messageAlert.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Forgot Password");
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
                        <h1 class="form-title">Forgot Password</h1>
            
                        <form id="forgotPasswordForm" class="space-y-4 md:space-y-6">
                            <div>
                                <label class="form-label" for="email">Email Address</label>
                                <input type="email" name="email" class="form-input" placeholder="name@company.com" required>
                            </div>
                            
                            <button type="submit" id="submit" class="btn-primary w-full">Reset Password</button>
                            
                            <div class="flex items-center justify-center">
                                <a href="/" class="link text-center" data-link>Home</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    `;
}

    async afterRender() {
        const form = document.getElementById('forgotPasswordForm');
        if (!form) {
            console.error('Forgot password form not found.');
            return;
        }
    
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const jsonData = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('http://localhost:8080/api/users/forgot_password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonData)
                });

                if (response.ok) {
                    window.history.pushState(null, null, '/');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                } else {
                    const data = await response.json();
                    // console.error("Error:", error);
                    showMessage('alertContainer', data?.error || 'Failed to reset password', 'error');
                }
            } catch (error) {
                // console.error('Error:', error);
                showMessage('alertContainer', 'An error occurred while resetting password', 'error');
            }
        });
    }
}
