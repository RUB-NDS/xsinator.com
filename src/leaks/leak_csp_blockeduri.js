import { TEST_URL } from "./../config.js";

const leak = async (url) => {
    return new Promise(r => {
        let iframe = document.createElement('iframe')
        window.onmessage = (e) => {
            iframe.remove()
            if(e.data === 'https://example.com'){
                // detected redirect to example.com
                return r(1)
            }else if(url.includes(e.data)){
                // catch correct implementation
                return r(0)
            }
            else{
                return r(e.data)
            }
        }
        // timeout if no message
        setTimeout(() => {
            iframe.remove()
            return r(0)
        }, 1500)
        
        iframe.srcdoc = `<html>
        <head>
            <meta http-equiv='Content-Security-Policy' content="default-src * 'unsafe-inline'; connect-src ${TEST_URL}">
        </head>
        <body>
            <script>
                document.addEventListener('securitypolicyviolation', e => {parent.postMessage(e.blockedURI, '*')})
                fetch('${url}', {mode:'no-cors', credentials: 'include'})
            <\/script>
        </body>
        </html>`

        document.body.appendChild(iframe)

    })
}


export { leak }