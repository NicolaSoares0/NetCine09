const apiKey = 'b2a5f91d';

const moviesContainer = document.getElementById('movies-container');
const loadingIndicator = document.getElementById('loading-indicator');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

function showLoading() {
    moviesContainer.innerHTML = '';
    const loadingClone = loadingIndicator.cloneNode(true);
    moviesContainer.appendChild(loadingClone);
    loadingIndicator.style.display = 'block';
}

function displayMovies(movies) {
    loadingIndicator.style.display = 'none';
    moviesContainer.innerHTML = '';

    if (!movies || movies.length === 0) {
        moviesContainer.innerHTML = '<div class="alert alert-warning">Nenhum filme encontrado. Tente um termo de busca diferente.</div>';
        return;
    }

    movies.forEach(movie => {
        if (!movie.Poster || movie.Poster === 'N/A') return;

        const card = document.createElement('div');
        card.className = 'col-md-4 col-lg-3 mb-4';
        const movieTitle = movie.Title.replace(/'/g, "\\'").replace(/"/g, '&quot;');

        card.innerHTML = `
            <div class="card h-100">
                <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${movie.Title} (${movie.Year})</h5>
                    <div class="mt-auto pt-3">
                        <button class="btn btn-primary w-100 mb-2" onclick="addMovieToList('${movie.imdbID}', '${movieTitle}', '${movie.Poster}', 'to-watch')">
                            <i class="fas fa-plus-circle"></i> Para Assistir
                        </button>
                        <button class="btn btn-success w-100" onclick="addMovieToList('${movie.imdbID}', '${movieTitle}', '${movie.Poster}', 'watched')">
                            <i class="fas fa-check-circle"></i> Já Assisti
                        </button>
                    </div>
                </div>
            </div>
        `;
        moviesContainer.appendChild(card);
    });
}

function addMovieToList(id, title, posterUrl, status) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;
    const movie = { id, title, poster_path: posterUrl, status };
    addMediaItemForUser(loggedInUser.id, movie);
    alert(`'${title}' foi adicionado à sua lista!`);
}

async function searchMovies(term) {
    showLoading();
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${term}&apikey=${apiKey}&type=movie`);
        const data = await response.json();
        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            displayMovies([]); 
        }
    } catch (error) {
        console.error('Erro ao pesquisar filmes:', error);
        moviesContainer.innerHTML = '<div class="alert alert-danger">Ocorreu um erro na busca. Tente novamente.</div>';
    }
}

async function fetchInitialMovies() {
    if (apiKey === 'SUA_CHAVE_API_AQUI' || apiKey === '') {
        moviesContainer.innerHTML = `<div class="alert alert-warning"><strong>Atenção:</strong> Adicione sua chave de API da OMDb no arquivo <strong>js/filmes.js</strong> para carregar os filmes.</div>`;
        return;
    }

    showLoading();
    const searchTerms = ['avengers', 'star wars', 'jurassic', 'mission', 'fast', 'spider', 'king', 'matrix'];
    const moviesMap = new Map();
    const fetchPromises = searchTerms.map(term =>
        fetch(`https://www.omdbapi.com/?s=${term}&apikey=${apiKey}&type=movie`).then(res => res.json())
    );

    try {
        const results = await Promise.all(fetchPromises);
        results.forEach(result => {
            if (result.Search) {
                result.Search.forEach(movie => moviesMap.set(movie.imdbID, movie));
            }
        });
        displayMovies(Array.from(moviesMap.values()));
    } catch (error) {
        console.error('Erro ao buscar filmes iniciais:', error);
        moviesContainer.innerHTML = '<div class="alert alert-danger">Não foi possível carregar os filmes. Tente novamente mais tarde.</div>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchInitialMovies();

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchMovies(searchTerm);
        }
    });
});