var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
  console.log('a user connected');
  console.log(socket.handshake.query.sala);
  console.log(io.sockets.clients()[0]);
  var redisClient = redis.createClient();
  redisClient.subscribe('message');
  redisClient.on("message", function(channel, data) {
    data = JSON.parse(data);
    console.log(data['message']);
    console.log("mew message add in queue "+ data.message + " channel");
    socket.emit(channel, data);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
    redisClient.quit();
  });
});

http.listen(8890, function(){
  console.log('listening on *:8890');
});

/*
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
 
server.listen(8890);
io.on('connection', function (socket) {
  console.log(socket);
  console.log("client connected");
  var redisClient = redis.createClient();
  redisClient.subscribe('message');
 
  redisClient.on("message", function(channel, data) {
    data = JSON.parse(data);
    console.log(data['message']);
    console.log("mew message add in queue "+ data.message + " channel");
    socket.emit(channel, data);
  });
 
  socket.on('disconnect', function() {
    redisClient.quit();
  });
 
});
*/