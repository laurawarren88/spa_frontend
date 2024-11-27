export function showMessage(containerId, message, type) {
    const alertContainer = document.getElementById(containerId);
    if (!alertContainer) return;

    if (type === 'error') {
        alertContainer.innerHTML = `
            <div class="message-container">
                <div class="message-layout">
                    <h1 class="message-title text-red-600">Error</h1>
                    <p class="message-text">${message}</p>
                </div>
            </div>
        `;
        alertContainer.classList.remove('hidden');

        setTimeout(() => {
            alertContainer.innerHTML = '';
            alertContainer.classList.add('hidden');
        }, 5000);
    }
}