function loadUserLists() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    const toWatchList = document.getElementById('to-watch-list');
    const watchedList = document.getElementById('watched-list');
    toWatchList.innerHTML = '';
    watchedList.innerHTML = '';

    const items = getMediaItemsForUser(loggedInUser.id);
    const toWatchItems = items.filter(item => item.status === 'to-watch');
    const watchedItems = items.filter(item => item.status === 'watched');

    if (toWatchItems.length === 0) {
        toWatchList.innerHTML = '<p class="text-muted">Sua lista para assistir está vazia. Explore a <a href="filmes.html">página de filmes</a> para adicionar novos títulos.</p>';
    } else {
        toWatchItems.forEach(item => toWatchList.appendChild(createMediaCard(item)));
    }

    if (watchedItems.length === 0) {
        watchedList.innerHTML = '<p class="text-muted">Você ainda não marcou nenhum filme como assistido.</p>';
    } else {
        watchedItems.forEach(item => watchedList.appendChild(createMediaCard(item)));
    }
}

function createMediaCard(item) {
    const card = document.createElement('div');
    card.className = 'col-md-4 col-lg-3 mb-4';
    
    const buttonHtml = item.status === 'to-watch' 
        ? `<button class="btn btn-success btn-sm w-100" onclick="updateItemStatus('${item.id}', 'watched')"><i class="fas fa-check"></i> Marcar como Assistido</button>`
        : `<button class="btn btn-secondary btn-sm w-100" onclick="updateItemStatus('${item.id}', 'to-watch')"><i class="fas fa-undo"></i> Mover para Assistir</button>`;

    const posterUrl = item.poster_path || 'https://via.placeholder.com/500x750.png?text=No+Image';

    card.innerHTML = `
        <div class="card h-100">
            <img src="${posterUrl}" class="card-img-top" alt="${item.title}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${item.title}</h5>
                <div class="mt-auto">
                    ${buttonHtml}
                    <button class="btn btn-danger btn-sm w-100 mt-2" onclick="removeItem('${item.id}')"><i class="fas fa-trash"></i> Remover</button>
                </div>
            </div>
        </div>
    `;
    return card;
}

function updateItemStatus(mediaId, newStatus) {
    const userId = getLoggedInUser().id;
    updateMediaItemStatusForUser(userId, mediaId, newStatus);
    loadUserLists();
}

function removeItem(mediaId) {
    if (confirm('Tem certeza que deseja remover este item?')) {
        const userId = getLoggedInUser().id;
        removeMediaItemForUser(userId, mediaId);
        loadUserLists();
    }
}

document.addEventListener('DOMContentLoaded', loadUserLists);