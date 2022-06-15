import {Notify} from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/';
const key = '28030161-9108d6deb48277e8b90eb1d15';
let page = 1;
let per_page = 40;
let parameters = `image_type=photo&orientation=horizontal&safesearch=true&per_page=${per_page}&page=${page}`
let q = '';
let currentList = [];
var lightbox = null;

const form = document.querySelector('form');
const gallery = document.querySelector('.gallery');

const loadMore = document.querySelector('.load-more');
const searchInput = document.getElementsByName('searchQuery')[0];







function filterResponse({hits}) {
    return hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads })
    )
}

function checkResponse({data}) {
    if (data.hits.length === 0) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        return
    } else if (data.hits.length < per_page) {
        Notify.info("We're sorry, but you've reached the end of search results.")
        return data
    }
    Notify.success(`Hooray! We found ${data.totalHits} images.`)
    console.log(data)
    return data
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (e.currentTarget.elements.searchQuery.value !== q) {
        page = 1;
        clearGallery();
        q = e.currentTarget.elements.searchQuery.value;

        axios.get(`${BASE_URL}?key=${key}&q=${q}&${parameters}`)
            .then(checkResponse)
            .then(filterResponse)
            .then(getCards)
            .then(setCards)
            .then(response => initLightBox())
            .catch(console.log)
    }



    


})

function getCards(arr) {

    currentList = currentList.concat(arr)

    const cards = arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
        <a href="${largeImageURL}">
            <div class="photo-card">
                <div class="thumb">
                    <img src='${webformatURL}' alt='${tags}' loading="lazy"/>
                </div>
                <div class="info">
                    <p class="info-item">
                    <b>Likes</b>
                    ${likes}
                    </p>
                    <p class="info-item">
                    <b>Views</b>
                    ${views}
                    </p>
                    <p class="info-item">
                    <b>Comments</b>
                    ${comments}
                    </p>
                    <p class="info-item">
                    <b>Downloads</b>
                    ${downloads}
                    </p>
                </div>
            </div>
        </a>
    `)

    return cards
}

function clearGallery() {
    gallery.innerHTML = '';
}

function setCards(data) {
    gallery.innerHTML = data.join('');
}

function addCards(data) {
    gallery.insertAdjacentHTML('beforeend', data.join(''));
    lightbox.refresh();
}



function initLightBox() {
    lightbox = new SimpleLightbox('.gallery a');
    lightbox.on('show.simplelightbox', function () {
	// do something…
    });
}

loadMore.addEventListener('click', () => {
    if (q === searchInput.value) {
        console.log(page)

        axios.get(`${BASE_URL}?key=${key}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page+=1}`)
            .then(checkResponse)
            .then(filterResponse)
            .then(getCards)
            .then(addCards)
            .catch(console.log)
    }
})