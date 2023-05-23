import axios from "axios";

export default axios.create({
    baseURL: process.env.DOMAINURL,
    headers: {
        'content-type': 'application/json'
    }
})