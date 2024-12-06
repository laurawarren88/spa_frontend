export function requireAuth(ViewClass) {
    return class AuthenticatedView extends ViewClass {
        async getHtml() {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='));

            if (!token) {
                return `
                    <div class="auth-error">
                        <h2>Authentication Required</h2>
                        <p>Please <a href="/users/login" data-link>login</a> to access this page.</p>
                    </div>
                `;
            }
            return super.getHtml();
        }
    };
}
