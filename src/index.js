import {Notify} from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/';
const key = '28030161-9108d6deb48277e8b90eb1d15';
const parameters = 'image_type=photo&orientation=horizontal&safesearch=true'
let q = '';

const form = document.querySelector('form');
const gallery = document.querySelector('.gallery');





function filterResponse({hits}) {
    return hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads })
    )
}

function checkResponse({data}) {
    if (data.hits.length === 0) {
        Notify.info("Sorry, there are no images matching your search query. Please try again.")
        return
    }
    return data
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearGallery()

    q = e.currentTarget.elements.searchQuery.value;

    axios.get(`${BASE_URL}?key=${key}&q=${q}&${parameters}`)
        .then(checkResponse)
        .then(filterResponse)
        .then(setCards)
        .catch(console.log)

})

function setCards(arr) {
    const cards = arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
        <a href="${largeImageURL}">
            <div class="photo-card">
                <img src='${webformatURL}' alt='${tags}' loading="lazy" />
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

    gallery.innerHTML = cards.join('');
}

function clearGallery() {
    gallery.innerHTML = '';
}

let galleryBox = new SimpleLightbox('.gallery a');
galleryBox.on('show.simplelightbox', function () {
	// do something…
});