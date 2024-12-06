export function requireAdmin(ViewClass) {
    return class AdminView extends ViewClass {
        async getHtml() {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='));
            
            const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
            
            if (!payload?.isAdmin) {
                return `
                    <div class="auth-error">
                        <h2>Admin Access Required</h2>
                        <p>You need administrator privileges to access this page.</p>
                    </div>
                `;
            }
            return super.getHtml();
        }
    };
}
