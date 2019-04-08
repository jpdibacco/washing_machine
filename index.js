var express = require('express');
var path = require('path');
var app = express();
const PORT = process.env.PORT || 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
  console.log('a user connected');
});
http.listen(PORT, function(){
  console.log('listening on *:3000');
});
var countdown = 1000;
setInterval(function() {
  countdown--;
  io.sockets.emit('timer', { countdown: countdown });
}, 1000);
io.sockets.on('connection', function (socket) {
  socket.on('reset', function (data) {
    countdown = 1000;
    io.sockets.emit('timer', { countdown: countdown });
  });
})