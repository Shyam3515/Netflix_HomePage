const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
// shows popular movies 
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const imgPath = "https://image.tmdb.org/t/p/original";
//genre
const apiPath = {
    //https://api.themoviedb.org/3/genre/movie/list?api_key=1cf50e6248dc270629e802686245c2c8
    fetchAllCategories : `${BASE_URL}/genre/movie/list?${API_KEY}`,
    fetchMoviesList: (id) => `${BASE_URL}/discover/movie?${API_KEY}&with_genres=${id}`,
    fetchTrending:`${BASE_URL}/trending/all/day?${API_KEY}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC0SZJkHFX-fQ7NrsxdI4l4mGwYuY4l7P8`
}

//function alert
function onload(){
    trending();
    fetchAndBuildCategories();
    // alert('Hi! Shyam :)')
}

function trending(){
    fetchAndBuildMoviesSection('Trending Now',apiPath.fetchTrending)
    .then(list =>{
        const randomImg = parseInt(Math.random() * (list.length -1));
        if(list[randomImg].title !== 'undefined'){
            buildBannerSection(list[randomImg]);
        }
        else{
            buildBannerSection(list[randomImg+2]);
        } 
    })
    .catch(err =>console.log(err));
}
// Banner Section
function buildBannerSection(movie){
    const bannerSection = document.getElementById('banner-section');
    bannerSection.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;

    const div = document.createElement('div');
    div.innerHTML = `
        <h2 class="banner-title">${movie.title}</h2>
        <p class="banner-info">Trending movie | Released on ${movie.release_date} </p>
        <p class="banner-overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+ '...':movie.overview}</p>
        <div class="action-buttons-cont">
            <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp;&nbsp; Play</button>
            <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> &nbsp;&nbsp; More Info</button>
        </div>
    `
    div.className = "banner-content container";
    bannerSection.append(div);
}


function fetchAndBuildCategories(){
    fetch(apiPath.fetchAllCategories)
    .then(res => res.json())
    .then(data =>{
        const categories = data.genres;
        if(Array.isArray(categories) && categories.length){
            categories.forEach((category) => {
                fetchAndBuildMoviesSection(
                    category.name,
                    apiPath.fetchMoviesList(category.id)
                );
            });
        }
        console.table(categories)
    })
    .catch(err => console.error(err))
}
//onload
window.addEventListener('load',function(){
    onload();
    this.window.addEventListener('scroll',function(){
        const header = document.getElementById("header");
        if(this.window.scrollY > 5){
            header.classList.add('header-bg');
        }else{
            header.classList.remove('header-bg');
        }
    })
});

function fetchAndBuildMoviesSection(categoryName,fetchUrl){
    console.log("1: ",categoryName,"2: ",fetchUrl);
    return fetch(fetchUrl)
    .then(res =>res.json())
    .then(data => {
        // console.table(data.results)
        const movies = data.results;
        if(Array.isArray(movies) && movies.length){
            buildMoviesSection(movies,categoryName)
        }
        return movies;
    })
}

function buildMoviesSection(list,categoryName){
    // console.log(list,categoryName);
    const moviesCont = document.getElementById('movies-cont');
    const moviesListHTML = list.map(item =>{
        return `
            <img src="${imgPath}${item.backdrop_path}" alt="${item.title}" class="img-item">
        `
    });

    const moviesSectionHTML = `
        <h2 class="section-heading">${categoryName} <span class="explore"> Explore All</span></h2>
        <div class="movie-row-cont">
            <div class="movies-row">
                <div class="image">
                    ${moviesListHTML}
                </div>
            </div>
        </div>   
    `
    // console.log(moviesListHTML);
    const div = document.createElement('div');
    div.className = "movies-section";
    div.innerHTML = moviesSectionHTML;
    //Appending movies into movies container
    moviesCont.appendChild(div);
}
