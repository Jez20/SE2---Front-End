import domainSource from "../common/domain-source";


const loginFunction = (data) => {
    return domainSource.post('login/', data)
}

export default {loginFunction}