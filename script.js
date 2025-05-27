const API_KEY = '76112da5e6344744b4d156f8f3b17c20';
const GAMES_PER_PAGE = 10;
let currentPage = 1;
let allGames = [];


const gamesContainer = document.getElementById('games-container');
const paginationContainer = document.getElementById('pagination');


async function fetchGames() {
    try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=30`);
        const data = await response.json();
        allGames = data.results;
        renderGames();
        renderPagination();
    } catch (error) {
        console.error('Error fetching games:', error);
        gamesContainer.innerHTML = '<p>Error al cargar los juegos. Por favor, intenta nuevamente.</p>';
    }
}

function renderGames() {
    const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
    const endIndex = startIndex + GAMES_PER_PAGE;
    const gamesToShow = allGames.slice(startIndex, endIndex);

    gamesContainer.innerHTML = ''; // Limpiar contenido anterior

    gamesToShow.forEach(game => {
        let platformsHTML = '';
        if (game.platforms && game.platforms.length > 0) {
            for (let i = 0; i < game.platforms.length; i++) {
                platformsHTML += '<span class="platform-tag">' + game.platforms[i].platform.name + '</span>';
            }
        } else {
            platformsHTML = '<span class="platform-tag">No hay plataformas</span>';
        }

        let storesHTML = '';
        if (game.stores && game.stores.length > 0) {
            let count = 0;
            for (let i = 0; i < game.stores.length; i++) {
                if (count >= 3) break;
                let store = game.stores[i].store;
                storesHTML += '<a href="https://' + store.domain + '" target="_blank" class="store-link">' + store.name + '</a>';
                count++;
            }
        } else {
            storesHTML = '<span class="store-link">No hay tiendas disponibles</span>';
        }

        const gameHTML =
            '<article class="game-card">' +
                '<img src="' + (game.background_image || 'https://via.placeholder.com/400x225?text=No+Image') + '" alt="' + game.name + '" class="game-image">' +
                '<section class="game-content">' +
                    '<h3 class="game-title">' + game.name + '</h3>' +
                    '<p class="game-info">📅 Fecha de lanzamiento: ' + (game.released || 'No disponible') + '</p>' +
                    '<p class="game-info">🕒 Última actualización: ' + (new Date(game.updated).toLocaleDateString() || 'No disponible') + '</p>' +
                    '<div class="platforms">' + platformsHTML + '</div>' +
                    '<div class="stores">' + storesHTML + '</div>' +
                '</section>' +
            '</article>';

        gamesContainer.innerHTML += gameHTML;
    });
}

// Función para renderizar la paginación
function renderPagination() {
    const totalPages = Math.ceil(allGames.length / GAMES_PER_PAGE);
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderGames();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationContainer.appendChild(pageBtn);
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', fetchGames);
