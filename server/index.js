const express = require("express");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const app = express();
app.listen(PORT, () => {
console.log(`Server listening on ${PORT}`);
});

app.get('/api', (req, res) => {
//res.json({ message: 'Hello from server side!' });
//res.sendFile('./pwa_cache_fj2022.html', {title:'Titulo'});
fs.readFile('client/pwa_cache_fj2022.html', function(err, html){
    if (err) {
        throw err; 
    }       
    res.write(html);
})
});