const leak = async (url) => {
    let em = document.createElement('img');
    em.src = url
    return new Promise(r => {
        em.onload = em.onerror = () => {
            em.remove()
            let perf = performance.getEntriesByType("resource").filter((e) => {
                return e.name === url
            }).pop()
            console.debug(`${perf}`)
            if(perf){
                if(perf.nextHopProtocol === ""){
                    return r(1)
                }
                return r(0)
            }else{
                return r(1)
            }
        }
        document.body.appendChild(em)
    })
}


export { leak }