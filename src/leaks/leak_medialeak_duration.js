const leak = async (url) => {
    return new Promise(r => {
        let audio = document.createElement('audio')
        audio.src = url
        audio.onloadedmetadata = (e) => {
            let duration = e.target.duration
            e.target.remove()
            console.debug(duration)
            // short hardcoded file should be 0.251451
            if(duration < 0.3){
                return r(0)
            }else{
                return r(1)
            }
        }
        document.body.appendChild(audio)
    })
}

export { leak }