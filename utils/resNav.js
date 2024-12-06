export function updateNavigation(isAuthenticated) {
    const publicLinks = document.querySelector('.auth-public');
    const privateLinks = document.querySelector('.auth-private');
    
    if (isAuthenticated) {
        publicLinks.classList.add('hidden');
        privateLinks.classList.remove('hidden');
    } else {
        publicLinks.classList.remove('hidden');
        privateLinks.classList.add('hidden');
    }
}
updateNavigation(false);

export function initScrollNavigation() {
    const navbar = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            navbar.classList.remove('bg-transparent');
            navbar.classList.add('bg-black/75');
        } else {
            navbar.classList.remove('bg-black/75');
            navbar.classList.add('bg-transparent');
        }
    });
}

export function mobileButton() {
    const btn = document.querySelector('button.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');
    const navbar = document.querySelector('nav');

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        navbar.classList.toggle('bg-black/75');
        navbar.classList.toggle('bg-transparent');
        navbar.classList.add('transition-all', 'duration-300');
    });
}
