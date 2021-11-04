const leak = async (url) => {
    let ele = document.createElement('iframe');
    ele.src = url
    return new Promise(r => {
        ele.onload = ele.onerror = () => {
            ele.remove()
            let perf = performance.getEntriesByType("resource").filter((e) => {
                return e.name === url
            }).pop()
            console.debug(perf)
            // safari
            if(perf.redirectStart === 0){
                return r(0)
            }else{
                return r(1)
            }
        }
        document.body.appendChild(ele)
    })
}


export { leak }