// Catálogo de juegos (datos usados por favoritos y por la página de detalle)
const G = [
    {
        id: 'wanted',
        n: 'Wanted',
        img: 'Wanted.webp',
        t: 'Tragamonedas',
        th: 'Lejano Oeste',
        s: 'Hacksaw Gaming',
        u: 'https://www.hacksawgaming.com',
        d: 'Wanted Dead or a Wild te lleva al Lejano Oeste, entre pistoleros, carteles de “se busca” y mucha acción.'
    },
    {
        id: 'slayer',
        n: 'Slayer',
        img: 'Slayer.jpg',
        t: 'Tragamonedas',
        th: 'Futurista',
        s: 'Big Time Gaming',
        u: 'https://www.bigtimegaming.com',
        d: 'Slayers Inc tiene una estética urbana y oscura, con un personaje encapuchado y un estilo gráfico en blanco y negro con detalles amarillos.'
    },
    {
        id: 'eyepanda',
        n: 'Eye Panda',
        img: 'EyeofPanda.webp',
        t: 'Tragamonedas',
        th: 'Animales',
        s: 'Por confirmar',
        u: 'https://www.google.com/search?q=Eye+of+the+Panda+juego+estudio',
        d: 'Eye of the Panda tiene como protagonista a un panda con aire rebelde y letras verde neón. Un juego de estilo moderno y colorido.'
    },
    {
        id: 'kraken2',
        n: 'Kraken2',
        img: 'Kraken.jpeg',
        t: 'Tragamonedas',
        th: 'Océano',
        s: 'Pragmatic Play',
        u: 'https://www.pragmaticplay.com',
        d: 'Release the Kraken 2 sumerge al jugador en el fondo del mar, con tiburones, criaturas marinas y un colorido mundo submarino.'
    },
    {
        id: 'aviamaster',
        n: 'AviaMaster',
        img: 'AviaMaster.webp',
        t: 'Crash',
        th: 'Aviación',
        s: 'BGaming',
        u: 'https://bgaming.com',
        d: 'Avia Masters 2 es un juego de estilo arcade protagonizado por un avioncito rojo que vuela entre las nubes.'
    },
    {
        id: 'frkn',
        n: 'FRKN',
        img: 'frkn.jpg',
        t: 'Tragamonedas',
        th: 'Cómic',
        s: 'Hacksaw Gaming',
        u: 'https://www.hacksawgaming.com',
        d: 'FRKN Bananas mezcla humor y estilo de cómic con bananas de lo más locas sobre un fondo violeta.'
    },
    {
        id: 'lezeus',
        n: 'Le Zeus',
        img: 'lezeus.jpg',
        t: 'Tragamonedas',
        th: 'Mitología',
        s: 'Hacksaw Gaming',
        u: 'https://www.hacksawgaming.com',
        d: 'Le Zeus reinventa la mitología griega con un mapache enojado, corona de laureles y rayos entre las nubes.'
    },
    {
        id: 'penalty',
        n: 'Penalty',
        img: 'PenaltyShoot.jpeg',
        t: 'Deportes',
        th: 'Fútbol',
        s: 'Evoplay',
        u: 'https://evoplay.games',
        d: 'Penalty te pone en el estadio para una tanda de penales, con un arquero listo para atajar.'
    }
];

// Helpers y almacenamiento de favoritos
const $ = (selector, context = document) => context.querySelector(selector);

const get = () => {
    try {
        return (JSON.parse(localStorage.getItem('tpl_fav')) || [])
            .filter(id => G.some(game => game.id === id));
    } catch (error) {
        return [];
    }
};

const put = favorites => {
    try {
        localStorage.setItem('tpl_fav', JSON.stringify(favorites));
    } catch (error) {
        // El almacenamiento local puede estar deshabilitado por el navegador.
    }
};

const byId = id => G.find(game => game.id === id);

// Actualiza los botones y el panel de favoritos
function refresh() {
    const favorites = get();

    $('#fc').textContent = favorites.length;
    $('#fc').hidden = !favorites.length;

    // El panel cambia según los favoritos, por eso se arma desde JS
    $('#fp').innerHTML = favorites.length
        ? favorites.map(id => {
            const game = byId(id);
            return `
                <div class="fi">
                    <a href="Juego.html?id=${id}">
                        <img src="${game.img}" alt="">
                        <span>${game.n}</span>
                    </a>
                    <button class="fav-btn on" data-id="${id}" aria-label="Quitar ${game.n}"><svg viewBox="0 0 24 24"><path d="M12 21s-7-4.6-9.3-9A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 9.3 6c-2.3 4.4-9.3 9-9.3 9z"/></svg></button>
                </div>`;
        }).join('')
        : '<p class="fe">Todavía no tenés favoritos. Tocá el corazón de un juego para guardarlo.</p>';

    document.querySelectorAll('.fav-btn').forEach(button => {
        const isFavorite = favorites.includes(button.dataset.id);
        button.classList.toggle('on', isFavorite);
        button.setAttribute('aria-pressed', isFavorite);
    });
}

document.addEventListener('click', event => {
    const button = event.target.closest('.fav-btn');

    if (button) {
        const favorites = get();
        const index = favorites.indexOf(button.dataset.id);

        if (index < 0) {
            favorites.push(button.dataset.id);
        } else {
            favorites.splice(index, 1);
        }

        put(favorites);
        refresh();
        return;
    }

    if (event.target.closest('#fb')) {
        const panel = $('#fp');
        panel.hidden = !panel.hidden;
        $('#fb').setAttribute('aria-expanded', !panel.hidden);
    } else if (!event.target.closest('#fp')) {
        $('#fp').hidden = true;
    }
});

// Inicio: búsqueda sobre las tarjetas que ya están en el HTML
const grid = $('#grid');

if (grid) {
    $('#q').oninput = event => {
        const term = event.target.value.trim().toLowerCase();
        let visible = 0;

        grid.querySelectorAll('.card').forEach(card => {
            const match = $('h3', card).textContent.toLowerCase().includes(term);
            card.hidden = !match;
            if (match) visible++;
        });

        $('#none').hidden = visible > 0;
    };
}

// Juego: completa el detalle y elige las recomendaciones
const detail = $('#det');

if (detail) {
    const game = byId(new URLSearchParams(location.search).get('id')) || G[0];
    document.title = game.n + ' | Triplicamos';

    $('#d-img').src = game.img;
    $('#d-img').alt = game.n;
    $('#d-tag').textContent = game.t;
    $('#d-name').textContent = game.n;
    $('#d-desc').textContent = game.d;
    $('#d-type').textContent = game.t;
    $('#d-theme').textContent = game.th;
    $('#d-studio').textContent = game.s;
    $('#d-link').href = game.u;
    $('#d-fav').dataset.id = game.id;

    // Más juegos: oculta el actual y muestra solo 4 de los demás
    document.querySelectorAll('#more .card').forEach(card => {
        card.hidden = card.dataset.id === game.id;
    });

    [...document.querySelectorAll('#more .card:not([hidden])')].forEach((card, index) => {
        card.hidden = index >= 4;
    });
}

refresh();
