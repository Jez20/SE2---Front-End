import domainSource from "../common/domain-source";


const loginFunction = (data) => {
    return domainSource.post('login/', data, {withCredentials: true})
}

export default {loginFunction}