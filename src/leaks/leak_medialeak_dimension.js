const leak = async (url) => {
    return new Promise(r => {
        let img = document.createElement('img')
        img.src = url
        img.onload = (e) => {
            let naturalHeight = e.target.naturalHeight
            let naturalWidth = e.target.naturalWidth
            e.target.remove()
            console.debug(`naturalHeight: ${naturalHeight}, naturalWidth: ${naturalWidth}`)
            // small file should be 250
            if(naturalWidth <= 250){
                return r(0)
            }else{
                return r(1)
            }
        }
        document.body.appendChild(img)
    })
}


export { leak }