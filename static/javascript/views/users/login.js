import { updateNavigation } from "../../../../utils/resNav.js";
import boilerplate from "../boilerplate.js";

export default class extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Login");
        this.userId = params.userId;
    }

async getHtml() {
        return `
            <section class="">
                <div class="">
                    <h3 class="">Login</h3>
                    <form id="loginForm" class="" onsubmit="return false">
                        <label class="" for="email">Email</label>
                        <input type="text" name="email" placeholder="Email" required><br>
            
                        <label class="" for="password">Password</label>
                        <input type="password" name="password" placeholder="Password" required><br>
                        <div>
                            <a href="/user/signup" class="" data-link>Don't have an account?</a>
                            <a href="/user/forgot_password" class="" data-link>Forgot Password?</a>
                        </div>
                        <button type="submit" id="submit">Login</button>
            
                        <a href="/" data-link>Home</a>
                    </form>
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

                // ** Uncomment these for Debugging **
                // .then (console.log(document.cookie))
                const data = await response.json();
                console.log("Login Data:", data)
                // console.log("Cookie:", document.cookie);

                if (response.ok) {
                    updateNavigation(true);
                    window.history.pushState(null, null, `/profile`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                } else {
                    const errorResponse = await response.json();
                    console.error('Error response:', errorResponse);
                    alert(errorResponse?.error || 'Failed to Login');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while Logging in.');
            }
        });
    }
}
