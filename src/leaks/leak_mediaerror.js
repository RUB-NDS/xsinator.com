const leak = async (url) => {
    let audio = document.createElement('audio')
    // append resource, wait for error
    return new Promise(r => {
        audio.src = url
        audio.onerror = (e) => {
            // return audio.error.message
            let msg = e.target.error.message
            console.debug(msg)
            // cleanup
            audio.remove()
            if(msg === 'Failed to init decoder'){
                r(0)
            }else if(msg === '500: Internal Server Error'){
                r(1)
            }else{
                r(msg)
            }
        }
        document.body.appendChild(audio)
    })
}


export { leak }