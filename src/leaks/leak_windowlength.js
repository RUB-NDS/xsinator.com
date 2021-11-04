const leak = async (url) => {
    return new Promise(async (r) =>  {
        window.WW.location = url
        await sleep(500)
        return r(window.WW.length)
    })
    
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export { leak }