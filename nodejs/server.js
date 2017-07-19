var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

var sockets = new Array();

io.on('connection', function(socket){
    if(socket.handshake.query.sala){
        console.log(socket.id);
        sockets.push({
            id: socket.id,
            sala: socket.handshake.query.sala
        });
        var redisClient = redis.createClient();
        redisClient.subscribe('message');
        redisClient.on("message", function(channel, data) {
            data = JSON.parse(data);
            sockets.forEach(function(element, index, array){
                console.log(data.group);
                console.log(element.sala);
                if(element.sala == data.group){
                    io.clients[element.id].send()
                }
            });
            //console.log("mew message add in queue "+ data.message + " channel");
            //socket.emit(channel, data);
        });
        socket.on('disconnect', function(){
            sockets.forEach(function(element, index, array){
                if(element.id == socket.id){
                    sockets.splice(index, 1);
                }
            });
            redisClient.quit();
        });
    }else{
        next(new Error('Authentication error'));
    }
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