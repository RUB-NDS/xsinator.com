const leak = async (url) => {
    let ele = document.createElement('iframe');
    ele.src = url
    return new Promise(r => {
        ele.onload = ele.onerror = () => {
            ele.remove()
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
        document.body.appendChild(ele)
    })
}


export { leak }