import axios from "axios";

export default axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
        'content-type': 'application/json'
    }
})