import router from '../../routes/index.js';
import { initScrollNavigation, mobileButton }  from '../../utils/resNav.js';
import { showMessage } from '../../utils/messageAlert.js';

router();

document.addEventListener('DOMContentLoaded', () => {
    initScrollNavigation();
    mobileButton();
    showMessage();
});

