const leak = async (url) => {
    let em = document.createElement('iframe');
    em.src = url
    return new Promise(r => {
        em.onload = em.onerror = () => {
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
        }
        document.body.appendChild(em)
    })
}


export { leak }