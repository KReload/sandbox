var http = require('http');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser')
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://mosquitto');
var influx = require('influxdb-nodejs');
var dbClient = new influx('http://192.168.43.52:8086/telegraf');

var app = express();

const humiditySchema = {
  value:'i',
};

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/', function (req, res) {
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

app.get('/values', function(req,res){
  let data = [];
  dbClient.query('humidity')
  .addFunction('*')
  .then(e => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(e);
    res.end();
  })
  .catch(console.error)


});

app.post('/blink', function(req, res) {
    console.log("Received blink");
    var time = req.body.time; 
    console.log(time);
    res.writeHead(200);
    res.end();
    client.publish('led', time);
});

app.listen(8080, function(){
    console.log('Example app listening on port 8080');
}); 
