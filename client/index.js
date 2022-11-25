const channel = new BroadcastChannel('sw-messages');
channel.addEventListener('message', event => {
    if(event.data.type == 'point-update'){
        console.log('Received Broadcasted Message: Supposed success')
        console.log(event.data)
        displayUpdate(event.data.payload);
    }else{
        console.log('Receiving Broadcasted Messages: ' + event.data.msg)
    }
});

async function displayUpdate(data) {
    updatePage(data);
}

function updatePage(data){
    let markup = "<tr><th>Fecha</th><th>Hora</th><th>Latitud</th><th>Longitud</th></tr>"
    console.log(data)
    data.forEach(element => {
        markup += "<tr>" 
        markup += `<td>${element.fecha}</td>`
        markup += `<td>${element.hora}</td>`
        markup += `<td>${element.lat}</td>`
        markup += `<td>${element.long}</td>`
        markup += "</tr>"
    })
    $("#locations-table").html(markup)
}


// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then(function(registration) {
        console.log('ServiceWorker registro : ',registration.scope);
    })
    .catch(function(err) {
        console.log('ServiceWorker error: ', err);
    });
}

