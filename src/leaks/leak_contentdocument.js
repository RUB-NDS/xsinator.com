const leak = async (url) => {
        return new Promise(async(r, e)=>{
            let obj = document.createElement('object')
            obj.data = url
            
            document.body.appendChild(obj)
            await sleep(750)

            console.debug(obj.contentDocument)
            // Check for error page
            if(obj.contentDocument !== null){
                obj.remove()
                return r(1)
            }else{
                obj.remove()
                return r(0)
            }  
        })
}


const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export { leak }