const leak = async (url) => {
    return new Promise((r) => {
        let s = document.createElement('link')
        s.rel = 'stylesheet'
        s.href = url
        s.onload = (e) => {
            let targetElement = document.createElement('div')
            // known class name
            targetElement.className = 'testclassname'
            document.body.appendChild(targetElement)
            let styles = window.getComputedStyle(targetElement, null)
            let visibility = styles.getPropertyValue('visibility')
            // cleanup
            targetElement.remove()
            s.remove()

            // return 1 if we were able to read 'hidden'
            if(visibility === 'hidden'){
                return r(1)
            }
            else{
                return r(0)
            }
        }
        s.onerror = (e) => {
            s.remove()
            return r(0)
        }

        document.head.appendChild(s)
    })
}


export { leak }