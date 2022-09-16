self.addEventListener("fetch", function(event) {
  
  /*/
  $.put('/testdata', {"fecha" : "16/09/2022",
  "hora" : "14:00",
  "lat" : "123456",
  "long" : "123456"})
  */
  
  fetch("/testdata",{
    method: 'POST',
    headers:{
      'Content-Type':'application/json'
      },
    params: JSON.stringify({"fecha" : "17/09/2022",
    "hora" : "15:00",
    "lat" : "123456",
    "long" : "123456"})
  })

  event.respondWith(
    fetch(event.request).catch(function() {
      return new Response(
        //archivo
        
        );
    })
  );
});