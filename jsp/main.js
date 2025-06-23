document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = getLoggedInUser();

    if (!loggedInUser) {
        window.location.href = 'index.html';
        return;
    }

    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logoutUser();
            window.location.href = 'index.html';
        });
    }
});