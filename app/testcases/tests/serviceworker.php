<?php



if(isset($_GET['script'])){
    header("Content-Type: text/javascript");
    ?>console.log(1)<?php 
    die();
}


if(isset($_GET['sw'])){
    header("Content-Type: text/javascript");
    ?>

const cacheName = 'v1' // Can be any string
const cachedAssets = ['serviceworker.php?script']
// Call install event
self.addEventListener('install', (e) => {
    console.log(`[SW] Install Event CacheName=${cacheName} cachedAssets:`)
    console.log(cachedAssets)
    e.waitUntil(
        caches
        .open(cacheName)
        .then((cache) => {
            cache.addAll(cachedAssets)
        })
        .then(() => {
            self.skipWaiting()
        })
    )
})


self.addEventListener('activate', (e) => {
    console.log('[SW] Activate Event')
    // aktive the sw on on install
    clients.claim()
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
})

self.addEventListener('fetch', (e) => {
    console.log('[SW] Fetch Event')

    e.respondWith((async () => {
        const cachedResponse = await caches.match(e.request)
        if (cachedResponse) {
            console.log(e.request)
            console.log('[SW] ^^^ was in cache')
            return cachedResponse
        }
        console.log(e.request)
        console.log('[SW] ^^^ was not! in cache')
        return fetch(e.request);
    })())
})




<?
die();
}

if(isset($_GET['1'])){ ?>
    <script>
        navigator.serviceWorker.register('?sw', {useCache: false})
    </script>
<?php }


echo "//Ok";