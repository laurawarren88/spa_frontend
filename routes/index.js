import { homeRoutes, bookRoutes, reviewRoutes, userRoutes } from './routeDefinitions.js';
import { pathToRegex, getParams } from '../utils/router.js';

const router = async () => {
    const routes = [
        ...homeRoutes,
        ...bookRoutes,
        ...reviewRoutes,
        ...userRoutes,
    ];

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));
    const app = document.querySelector('#app');
    app.innerHTML = await view.getHtml();
    
    if (view.afterRender) {
        await view.afterRender();
    }
};

// const handleNavigation = (e) => {
//     if (e.target.matches('[data-link]')) {
//         e.preventDefault();
//         const href = e.target.getAttribute('href');
//         window.history.pushState({}, '', href);
//         router();
//     }
// };

const handleNavigation = (e) => {
    if (e.target.matches('[data-link]')) {
        e.preventDefault();
        const targetUrl = e.target.getAttribute('href');
        
        if (targetUrl) {
            window.history.pushState(null, null, targetUrl);
            router();
        }
    }
};

window.addEventListener('popstate', router);
window.addEventListener('load', router);
document.addEventListener('click', handleNavigation);

export default router;
