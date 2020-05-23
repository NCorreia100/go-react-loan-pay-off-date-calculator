//utils
const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const MemoryCache = require('memory-cache-stream');
//files
//instantiate processes
const app = express();
let mcache = new MemoryCache();

app.set('trust proxy', true);

app.use(compression()); //gzip compression
app.use(express.static(path.join(__dirname,'build'),{etag: true,maxAge: '5000'}));
// create flat cache routes

app.get('/app-bundle',(req,res)=>{
  let key ='/app-bundle';
 if(mcache.exists(key)){
  mcache.readStream(key)
     .pipe(res);
 }else{
  fs.createReadStream(path.join(__dirname,'build/app-bundle.js'))
  .pipe(mcache.writeThrough(key,  60*60*2)) //2h cache persistence
  .pipe(res);
 }
});  
 

app.get('/*', function (req, res) {  
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
  
});
app.listen(process.env.REACT_APP_PORT, () => { 
  console.log("CASPER server listening")
});