let APIKey = 'api_key=edfb9532fd904ce684a01caf0e77d461';
let BaseUrl = 'https://api.themoviedb.org/3/';
let API_URL = BaseUrl + 'discover/movie?sort_by=popularity.desc&' + APIKey;
const searchURL = BaseUrl + 'search/movie?' + APIKey;

const genres = [
    {"id":28,"name":"Action"},
    {"id":12,"name":"Adventure"},
    {"id":16,"name":"Animation"},
    {"id":35,"name":"Comedy"},
    {"id":80,"name":"Crime"},
    {"id":99,"name":"Documentary"},
    {"id":18,"name":"Drama"},
    {"id":10751,"name":"Family"},
    {"id":14,"name":"Fantasy"},
    {"id":36,"name":"History"},
    {"id":27,"name":"Horror"},
    {"id":10402,"name":"Music"},
    {"id":9648,"name":"Mystery"},
    {"id":10749,"name":"Romance"},
    {"id":878,"name":"Science Fiction"},
    {"id":10770,"name":"TV Movie"},
    {"id":53,"name":"Thriller"},
    {"id":10752,"name":"War"},
    {"id":37,"name":"Western"}
];


const movieContainer = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tag = document.getElementById('tags');

getGenre();
var selectedGenre = [];

function getGenre(){
    tag.innerHTML = '';
    genres.forEach(genre => {
        const tagEl = document.createElement('span');
        tagEl.classList.add('tag');
        tagEl.id = genre.id;
        tagEl.innerText = genre.name;
        tagEl.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            } else if(selectedGenre.includes(genre.id)){
                selectedGenre.forEach((id, idx) => {
                    if(id == genre.id){
                        selectedGenre.splice(idx, 1);
                    }
                })
            } else {
                selectedGenre.push(genre.id);
            }
            console.log(selectedGenre);
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')));
            highlightSelection();
        })
        tag.appendChild(tagEl);
    });
}

function highlightSelection(){
    const tags =document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove("highlight");
    })
    clear();
    if(selectedGenre.length != 0){
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
            
        })
    }
    
}

function clear(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight');
    }else{
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            getGenre();
            getMovies(API_URL);
            clear.classList.remove('highlight');
        })
        tag.append(clear);
    }
}
function getMovies(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data.results);
            if(data.results.length !== 0){
                showMovies(data.results);
            } else {
                movieContainer.innerHTML = `<h1 class="no-results">No Results Found</h1>`
            }
            
        });
}

getMovies(API_URL);

function showMovies(data) {
    movieContainer.innerHTML = ''; // Clear previous content
    data.forEach(movie => {
        const { title, poster_path, vote_average, overview } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
        `;
        movieContainer.appendChild(movieEl);
    });
}

function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    selectedGenre = [];
    highlightSelection();
    if (searchTerm) {
        getMovies(searchURL+'&query=' + searchTerm);
        search.value = '';
    }else{
        getMovies(API_URL);
    }   
});
