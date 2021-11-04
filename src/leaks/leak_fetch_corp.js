const leak = async (url) => {
    // During a cross-origin resource policy check, 
    // if the header is set, the browser will deny no-cors 
    // requests issued from a different origin/site.
    return fetch(url, {
        credentials: 'include',
        mode: 'no-cors'
    })
    .then(() => {
        // no error, no CORP
        return 0
    })
    .catch(() => {
        return 1
    }) 
}


export { leak }