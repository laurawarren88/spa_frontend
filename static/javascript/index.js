import router from '../../routes/index.js';
import { initScrollNavigation, mobileButton }  from '../../utils/resNav.js';

router();

document.addEventListener('DOMContentLoaded', () => {
    initScrollNavigation();
    mobileButton();
});

