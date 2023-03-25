import domainSource from "../common/domain-source";


const getInvetoryList = () => {
    return domainSource.get('/inventory/')
}

const deleteInventory = (code, id) => {
    return domainSource.delete(`/inventory/${code}`, {headers:{'sessionid': id}})
}

export default {getInvetoryList, deleteInventory}

