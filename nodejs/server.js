var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');
var sio = io.listen(http);

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

var sockets = new Array();

io.on('connection', function(socket){
    console.log('oi');
    if(socket.handshake.query.sala){
        console.log("Connected");
        sockets.push({
            id: socket.id,
            sala: socket.handshake.query.sala
        });
        var redisClient = redis.createClient();
        redisClient.subscribe('message');
        redisClient.on("message", function(channel, data) {
            data = JSON.parse(data);
            sockets.forEach(function(element, index, array){
                if(element.id == socket.id && element.sala == data.group){
                    sio.sockets.sockets[element.id].send(data);
                }
            });
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