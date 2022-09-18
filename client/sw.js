async function updateSupplyPoints(client) {
  // Start the network request as soon as possible.
  const channel = new BroadcastChannel('sw-messages');
  const networkPromise = fetch('/api/get_new_points', {
    method:'POST', 
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const cachedResponse = await caches.match('/api/get_new_points');
  if (cachedResponse){
    channel.postMessage({
      payload: cachedResponse,
      lastUpdated: new Date(),
      type: 'point-update'
    })
  }

  try {
    const networkResponse = await networkPromise;
    const cache = await caches.open('supply-dynamic');
    cache.put('/api/get_new_points', networkResponse.clone());
    channel.postMessage({
      payload: networkResponse,
      lastUpdated: new Date(),
      type: 'point-update'
    })
  } catch (err) {
    // Maybe report a lack of connectivity to the user.
    channel.postMessage({
        type: 'alert',
        msg: err
      });
  }
}

self.addEventListener('fetch', (event) => {
  event.waitUntil((async () =>{
    if (!event.clientId) return;
    
    // Get the client.
    const client = await clients.get(event.clientId);
    // Exit early if we don't get the client.
    // Eg, if it closed.
    if (!client) return;
    // Send a message to the client.
    updateSupplyPoints(client)
  })());
});
