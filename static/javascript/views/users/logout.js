import { updateNavigation } from "../../../../utils/resNav.js";
import { showMessage } from "../../../../utils/messageAlert.js";
import boilerplate from "../boilerplate.js";

class Logout extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Logout");
    }

    async getHtml() {
        return `
            <section class="bg-softWhite">
            
                <!-- Alert container -->
                <div id="alertContainer" class="hidden"></div>

                <div class="flex flex-col items-center justify-center mx-auto h-screen">
                    <div class="message-layout">
                        <h1 class="message-title">Logging Out...</h1>
                    </div>
                </div>
            </section>
        `;
    }

    async afterRender() {
        try {
            const response = await fetch('http://localhost:8080/api/users/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                localStorage.clear();
                sessionStorage.clear();
                updateNavigation(false);
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost; samesite=lax";
                setTimeout(() => {
                    window.history.pushState(null, null, `/`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }, 1000);
            } else {
                const data = await response.json();
                console.error("Error:", error);
                showMessage('alertContainer', data?.error || 'Failed to logout', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('alertContainer', 'An error occurred while logging out', 'error');
        }
    }
}

export default Logout;
