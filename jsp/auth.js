document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    if (getLoggedInUser()) {
        window.location.href = 'filmes.html';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loginError.textContent = '';
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                setLoggedInUser(user.id);
                window.location.href = 'filmes.html';
            } else {
                loginError.textContent = 'Email ou senha inválidos.';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registerError.textContent = '';
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            const users = getUsers();
            if (users.find(u => u.email === email)) {
                registerError.textContent = 'Este email já está cadastrado.';
                return;
            }

            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password 
            };

            users.push(newUser);
            saveUsers(users);
            setLoggedInUser(newUser.id);
            window.location.href = 'filmes.html';
        });
    }
});