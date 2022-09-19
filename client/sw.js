const channel = new BroadcastChannel('sw-messages');
async function updateSupplyPoints(requestResponse) {
  // Start the network request as soon as possible.
  /*
    const networkPromise = fetch('/api/get_new_points', {
      method:'POST', 
      headers: {
        'Content-Type': 'application/json'
      }
    });
  */
    const networkResponseJSON = await requestResponse.clone().json()

    const cache = await caches.open('supply-dynamic');
    cache.put('/api/get_new_points', requestResponse.clone());
}

async function sendCachedPoints(){
  const cachedResponse = await caches.match('/api/get_new_points');
    if (cachedResponse.clone()){
      const cachedResponseJSON = await cachedResponse.json()
      channel.postMessage({
        payload: cachedResponseJSON,
        lastUpdated: 'N/A',
        type: 'point-update'
      })
    }
}

self.addEventListener("install", (e) =>{
  e.waitUntil(
    caches.open("supply-dynamic").then( (cache) =>{
      cache.addAll([
        "index.html",
        'manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if(event.request.method == 'GET'){
    event.respondWith(
      fetch(event.request)
      .catch(()=>{
        return caches.match("index.html")
      })
    )
  }else if(event.request.method == 'POST'){
    fetch(event.request)
    .then(async requestResponse =>{
      await updateSupplyPoints(requestResponse)
    })
    .catch(err => {
      channel.postMessage({
        payload: err,
        type: 'error'
      })
    }
    )
    .finally(sendCachedPoints())
  }
})
