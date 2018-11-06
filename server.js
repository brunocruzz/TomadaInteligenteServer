var app = require('express')(),
  server = require('http').createServer(),
  io = require('socket.io')(server),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  User = require('./api/models/userModel'),
  Value = require('./api/models/valueModel'),
  jwt = require('jsonwebtoken'),
  Sensor = require('./api/models/sensorModel'),
  bodyParser = require('body-parser');

exports.io = io;

var uristring =
  process.env.MONGOLAB_URI ||
  process.env.MONGODB_URI ||
  'mongodb://localhost/sensordb';

mongoose.Promise = global.Promise;
mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/test', function(req, res) { res.json({data : 'hello'});})

io.on('connection', function(socket){
    console.log('connection');
    console.log('server: sending ping');
    socket.on('pong', function() {
        console.log('server received pong');
    });

    socket.on('message', function(message) {
        console.log('server received message: ' + message);
    });
    socket.emit('ping');
});

io.on('lol', function(client){
  console.log("received lol");
});

var routes = require('./api/routes/sensorRoutes');
routes(app);

server.listen(port, function () {
  var port = server.address().port;
  console.log('Sensor RESTful API server started on: ' + port);
});
