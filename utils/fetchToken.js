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

    const requestOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    const response = await fetch(url, requestOptions);

    if (response.status === 401) {
        window.location.href = '/user/login';
        throw new Error('Unauthorized. Redirecting to login.');
    }

    return response;
}