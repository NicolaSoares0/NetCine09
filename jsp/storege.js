function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getMediaItems() {
    return JSON.parse(localStorage.getItem('mediaItems')) || [];
}

function saveMediaItems(items) {
    localStorage.setItem('mediaItems', JSON.stringify(items));
}

function getLoggedInUser() {
    const userId = sessionStorage.getItem('loggedInUserId');
    if (!userId) return null;
    const users = getUsers();
    return users.find(user => user.id === parseInt(userId));
}

function setLoggedInUser(userId) {
    sessionStorage.setItem('loggedInUserId', userId);
}

function logoutUser() {
    sessionStorage.removeItem('loggedInUserId');
}

function getMediaItemsForUser(userId) {
    const allItems = getMediaItems();
    return allItems.filter(item => item.userId === userId);
}

function addMediaItemForUser(userId, mediaItem) {
    const items = getMediaItems();
    
    const existingItemIndex = items.findIndex(item => item.userId === userId && item.id === mediaItem.id);

    if (existingItemIndex > -1) {
        items[existingItemIndex].status = mediaItem.status;
    } else {
        const newItem = {
            ...mediaItem,
            userId: userId
        };
        items.push(newItem);
    }
    saveMediaItems(items);
}

function removeMediaItemForUser(userId, mediaId) {
    let items = getMediaItems();
    items = items.filter(item => !(item.userId === userId && item.id === mediaId));
    saveMediaItems(items);
}

function updateMediaItemStatusForUser(userId, mediaId, newStatus) {
    let items = getMediaItems();
    const itemIndex = items.findIndex(item => item.userId === userId && item.id === mediaId);
    if (itemIndex > -1) {
        items[itemIndex].status = newStatus;
        saveMediaItems(items);
    }
}

function updateUser(userId, updatedData) {
    let users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        users[userIndex].name = updatedData.name || users[userIndex].name;
        users[userIndex].email = updatedData.email || users[userIndex].email;
        if (updatedData.password) {
            users[userIndex].password = updatedData.password;
        }
        saveUsers(users);
    }
}

function removeUser(userId) {
    let users = getUsers();
    users = users.filter(u => u.id !== userId);
    saveUsers(users);

    let items = getMediaItems();
    items = items.filter(item => item.userId !== userId);
    saveMediaItems(items);
}