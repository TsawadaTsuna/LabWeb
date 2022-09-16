const express = require("express");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const app = express();
const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri ="mongodb+srv://kevin:1234@labweb.0d0l4cx.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);


app.use(express.static('client'));

async function newPoint(client, data){
    try{
        const points = client.db("Rutas").collection("Puntos");
        const newP =  await points.insertOne(data);
        console.log("inserted"+newP)
        } finally {
          await client.close();
        }
}

async function upload(data){
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        // Make the appropriate DB calls
        //await  listDatabases(client);
        
        await newPoint(client, data);
    
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function conectToPoints(client){
    try{
    const points = client.db("Rutas").collection("Puntos");
    const cursor = points.find({}, {projection:{ _id: 0 }});
    await cursor.forEach(console.dir);
    } finally {
      await client.close();
    }
  }

async function getPoints() {
	// we'll add code here soon
  try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Make the appropriate DB calls
      //await  listDatabases(client);
      await conectToPoints(client);

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}


app.get("/testdataget", (req, res) => {
    getPoints().catch(console.error);
    res.end("Pets");
})

app.post("/testdata", (req, res) => {
    let params = req.body
    console.log(params)
    /*
    data = {
        "fecha" : "16/09/2022",
        "hora" : "14:00",
        "lat" : "123456",
        "alt" : "123456"
    }*/
    /*
    data = {
        "fecha" : params.fecha,
        "hora" : params.hora,
        "lat" : params.lat,
        "long" : params.long
    }*/
    //upload(data).catch(console.error);
        res.end("Point inserted");
  })

app.get("/testdata", (req, res) => {
    getPoints().catch(console.error);
    res.end("Pets");
})


app.get('/api', (req, res) => {
//res.json({ message: 'Hello from server side!' });
//res.sendFile('./pwa_cache_fj2022.html', {title:'Titulo'});
/*fs.readFile('client/manifest.json', function(err, html){
    if (err) {
        throw err; 
    }       
    res.write(html);
})*/
/*fs.readFile('client/sw.js', function(err, html){
    if (err) {
        throw err; 
    }       
    res.send(html);
})*/
fs.readFile('client/pwa_cache_fj2022.html', function(err, html){
    if (err) {
        throw err; 
    }       
    res.write(html);
})
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    });