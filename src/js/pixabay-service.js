import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const key = '28030161-9108d6deb48277e8b90eb1d15';

let parameters = `image_type=photo&orientation=horizontal&safesearch=true&per_page=40`



export async function fetchPixabay(page, q) {

    const data = await axios.get(`${BASE_URL}?key=${key}&q=${q}&${parameters}&page=${page}`);
    return data

}

