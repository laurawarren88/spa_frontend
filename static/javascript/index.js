import router from '../../routes/index.js';
import { initScrollNavigation, mobileButton, updateProfileLink }  from '../../utils/resNav.js';
import { showMessage } from '../../utils/messageAlert.js';

router();

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
    initScrollNavigation();
    mobileButton();
    updateProfileLink();
    showMessage();
});

