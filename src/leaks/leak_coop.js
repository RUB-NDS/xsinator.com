const leak = async (url) => {
    return new Promise(async(r) => {
        window.WW.location = url
        // could be done differently
        await sleep(2000)
        if(window.WW.window){
            // no coop
            return r(0)
        }
        // this window is now DEAD
        return r(1)
    })
}

const sleep = (ms) => {
    return new Promise(r => setTimeout(r, ms));
}


export { leak }