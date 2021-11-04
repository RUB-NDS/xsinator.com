const leak = async (url) => {
    return new Promise((r) => {
        let s = document.createElement('script')
        s.src = url


        window.addEventListener('error', (e) => {
            s.remove()
            console.debug(`window.onerror: ${e.message}`)
            return r(0)
        }, { once: true })

        s.onload = s.onerror = async() => {
            // wait for error event
            await sleep(100)
            s.remove()
            return r(1)
        }

        document.head.appendChild(s)
    })
}

const sleep = (ms) => {
    return new Promise(r => setTimeout(r, ms));
}

export { leak }