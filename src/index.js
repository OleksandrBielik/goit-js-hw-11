import {Notify} from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import {fetchPixabay} from './js/pixabay-service';



const form = document.querySelector('form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const searchInput = document.getElementsByName('searchQuery')[0];

let page = 1;
let per_page = 40;
let q = '';
let currentList = 0;
var lightbox = null;





function filterResponse({hits}) {
    return hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads })
    )
}

function checkResponse({ data }) {
    if (data.hits.length === 0) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        hideButton()
        return
    } else if (data.totalHits-currentList <= per_page) {
        Notify.info("We're sorry, but you've reached the end of search results.")
        hideButton()
        return data
    } else if (currentList > 0) {
        removeDisabled()
        showButton()
        return data
    }
    Notify.success(`Hooray! We found ${data.totalHits} images.`)
    showButton()
    return data
}

async function transformResponse(page,q) {

    const data = await fetchPixabay(page, q)
    const checkedData = await checkResponse(data);
    const filteredData = await filterResponse(checkedData);
    const cardList = await getCards(filteredData);
    return cardList

}

async function setGallery() {
    try {
        const cardList = await transformResponse(page,q)
        setCards(cardList);
        initLightBox()

    } catch (error) {
        console.log(error)
    }

}

async function addGallery() {
    try {
        const cardList = await transformResponse(page+=1,q)
        addCards(cardList);
        lightbox.refresh();
        initScroll();

    } catch (error) {
        console.log(error)
    }

}

function getCards(arr) {

    currentList += arr.length

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
}

function showButton() {
    loadMore.style.display = 'block';
}

function hideButton() {
    loadMore.style.display = 'none';
}

function setDisabled() {
    loadMore.setAttribute('disabled','disabled')
}

function removeDisabled() {
    loadMore.removeAttribute('disabled');
}

function initScroll() {
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    window.scrollBy({top: cardHeight * 2, behavior: "smooth"})
}

function initLightBox() {
    lightbox = new SimpleLightbox('.gallery a');
    lightbox.on('show.simplelightbox', function () {
	// do something…
    });
}


searchInput.addEventListener('input', (e) => {
    if (e.target.value.trim() === "") {
        e.target.value = ""
    }

})

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (e.currentTarget.elements.searchQuery.value.trim() !== q) {
        page = 1;
        currentList = 0;
        removeDisabled()
        hideButton()
        clearGallery();
        q = e.currentTarget.elements.searchQuery.value.trim();
        setGallery()        
    }

})

loadMore.addEventListener('click', () => {
    setDisabled()
    hideButton()
    addGallery()
})