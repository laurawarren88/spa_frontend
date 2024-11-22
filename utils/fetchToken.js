export async function fetchToken(url, options = {}) {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    if (!token) {
        return `
            <div class="auth-error">
                <h2>Authentication Required</h2>
                <p>Please <a href="/users/login" data-link>login</a> to access this page.</p>
            </div>
        `;
    }

    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
    };

    if (!(options.body instanceof FormData)) {
        defaultOptions.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
            throw new Error('Admin access required');
        }
        throw new Error(errorData.error || 'Request failed');
    }

    return response;
}