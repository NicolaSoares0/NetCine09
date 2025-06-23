document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('user-form');
    const userIdInput = document.getElementById('user-id');
    const userNameInput = document.getElementById('user-name');
    const userEmailInput = document.getElementById('user-email');
    const userPasswordInput = document.getElementById('user-password');
    const userList = document.getElementById('user-list');

    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = userIdInput.value;
        const user = {
            name: userNameInput.value,
            email: userEmailInput.value,
            password: userPasswordInput.value,
        };

        if (id) {
            updateUser(parseInt(id), user);
        }
        userForm.reset();
        userIdInput.value = '';
        userPasswordInput.placeholder = "Deixe em branco para não alterar";
        loadUsers();
    });

    function loadUsers() {
        const users = getUsers();
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.textContent = `${user.name} (${user.email})`;
            
            const actions = document.createElement('div');
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-warning btn-sm me-2';
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Editar';
            editBtn.onclick = () => editUser(user.id);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger btn-sm';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Excluir';
            deleteBtn.onclick = () => deleteUser(user.id);

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            li.appendChild(actions);
            userList.appendChild(li);
        });
    }

    window.editUser = function(id) {
        const user = getUsers().find(u => u.id === id);
        if (user) {
            userIdInput.value = user.id;
            userNameInput.value = user.name;
            userEmailInput.value = user.email;
            userPasswordInput.value = '';
            userPasswordInput.placeholder = "Alterando senha de " + user.name;
            window.scrollTo(0,0);
        }
    }

    window.deleteUser = function(id) {
        if (id === getLoggedInUser().id){
            alert("Você não pode excluir o seu próprio usuário enquanto está logado.");
            return;
        }
        if (confirm('Tem certeza que deseja excluir este usuário e todos os seus dados?')) {
            removeUser(id);
            loadUsers();
        }
    }
    
    loadUsers();
});