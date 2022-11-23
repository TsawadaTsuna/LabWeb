const { json } = require("express");
const express = require("express");
const fs = require("fs");
const PORT = process.env.PORT || 8000;
const app = express();
const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri ="mongodb+srv://kevin:1234@labweb.0d0l4cx.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

//Express
app.use(express.static('client'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

async function connectToPoints(client){
    try{
    const points = client.db("Rutas").collection("Puntos");
    const cursor = points.find({}, {projection:{ _id: 0 }});
    let new_points = []
    await cursor.forEach((point) => {
        new_points.push(point)
    })
    return new_points;

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
      return await connectToPoints(client);
      
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

//Get home page (index.html)
app.get('/', (req, res) =>{
    res.sendFile('./client/index.html', {title:'pwa'});
});

app.get('/admin', (req, res) =>{
    res.sendFile('admin.html', {title:'admin page', root:'./client'});
});
//Standard api call
app.post('/api', (req, res) => {});

app.post('/api/insert_new_point', (req, res) => {
    let params = req.body
    console.log(params)
    data = {
        fecha : params.fecha,
        hora : params.hora,
        lat : params.lat,
        long : params.long
    }
    upload(data)
    .then(res.end("Point inserted"))
    .catch(console.error);
})

app.post('/api/get_new_points', (req, res) => {
    getPoints()
    .then(points_list =>JSON.stringify(points_list))
    .then(points_list=>{
        if(points_list){
            res.send(points_list)
        }
    })
    
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});