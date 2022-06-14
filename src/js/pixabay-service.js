const BASE_URL = 'https://pixabay.com/api/';
const key = '28030161-9108d6deb48277e8b90eb1d15';
const parameters = 'image_type=photo&orientation=horizontal&safesearch=true'
const image_type = 'photo';
const orientation = 'horizontal';
const safesearch = true;
let q = '';


fetch(`https://pixabay.com/api/?key=28030161-9108d6deb48277e8b90eb1d15&${parameters}`).then(response=>response.json()).then(console.log)