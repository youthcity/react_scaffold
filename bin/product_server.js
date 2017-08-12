var path = require('path')
var express = require('express')
var app = express()
let config = require('../config/index.js');
let _config = config();

const IP = _config.buildtime.origin_server.ip;
const PORT = _config.buildtime.origin_server.port;

app.use(express.static(path.join(__dirname, '../build/')));

app.get('/config', function(req, res){
  res.json(_config.runtime);
})

app.use(function (req, res) {
  res.sendFile(path.join(__dirname, '../build/'));
})

app.listen(PORT, function () {
  console.log('The app server is working at ' + PORT)
})
