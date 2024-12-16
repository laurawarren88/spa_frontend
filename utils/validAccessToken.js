export async function getValidAccessToken() {
    let token = document.cookie
    .split('; ')
    .find(row => row.startsWith('access_token='))
    ?.split('=')[1];

    if (!token) {
        const refreshToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('refresh_token='))
            ?.split('=')[1];

        if (refreshToken) {
            const refreshResponse = await fetch('/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                token = data.access_token; 
            } else {
                return `
                    <div class="auth-error">
                        <h2>Authentication Required</h2>
                        <p>Please <a href="/users/login" data-link>login</a> to access this page.</p>
                    </div>
                `;
            }
        } else {
            return `
                <div class="auth-error">
                    <h2>Authentication Required</h2>
                    <p>Please <a href="/users/login" data-link>login</a> to access this page.</p>
                </div>
            `;
        }
    }

    return token;
}