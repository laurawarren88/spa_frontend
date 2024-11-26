import { updateNavigation } from "../../../../utils/resNav.js";
import boilerplate from "../boilerplate.js";

class Logout extends boilerplate {
    constructor(params) {
        super(params);
        this.setTitle("Logout");
    }

    async getHtml() {
        try {
            const response = await fetch('http://localhost:8080/api/users/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                updateNavigation(false);
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost; samesite=lax";
                window.history.pushState(null, null, `/`);
                window.dispatchEvent(new PopStateEvent('popstate'));
            } else {
                const errorResponse = await response.json();
                console.error('Error response:', errorResponse);
                alert(errorResponse?.error || 'Failed to Login');
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('An error occurred while Logging out.')
        }
        return '';
    }

    async afterRender() {
        await this.getHtml();
    }
}

export default Logout;
