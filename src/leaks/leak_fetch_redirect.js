const leak = async (url) => {
    // Bug: manual + cors allowed
    return fetch(url, {
        credentials: 'include',
        mode: 'cors',
        redirect: 'manual',
    })
    .then(res => {
        console.debug(`res.type = ${res.type}`)
        if(res.type === 'opaqueredirect'){
            return 1
        }else{
            return undefined
        }
    })
    .catch(() => {
        return 0
    }) 
}


export { leak }