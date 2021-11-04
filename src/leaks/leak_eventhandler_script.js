const leak = async (url) => {
    return new Promise((r) => {
        let s = document.createElement('script')
        s.src = url
        s.onload = (e) => {
            e.target.remove()
            return r(0)
        }
        s.onerror = (e) => {
            e.target.remove()
            return r(1)
        }
        document.head.appendChild(s)
    })
}


export { leak }