require('dotenv').config();
var express = require('express');
var path = require('path');
var app = express();
const PORT = process.env.PORT || 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(require('body-parser').json());
//web-push
const webpush = require('web-push');
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
webpush.setVapidDetails('mailto:patricio.dibacco@acrovia.net', publicVapidKey, privateVapidKey);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
  console.log('a user connected');
});
http.listen(PORT, function(){
  console.log('listening on *:3000');
});
var countdown = 10;
setInterval(function() {
  countdown--;
  io.sockets.emit('timer', { countdown: countdown });
  console.log('countdown: ',countdown);
  if(countdown == 0){
    console.log('countdown is 0');
    sendPush();
  }
}, 1000);
io.sockets.on('connection', function (socket) {
  socket.on('reset', function (data) {
    countdown = 10;
    io.sockets.emit('timer', { countdown: countdown });
  });
});
//web-push:
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: 'test' });
  
    console.log(subscription);
  
    webpush.sendNotification(subscription, payload).catch(error => {
      console.error(error.stack);
    });
  });
function sendPush(){
    const subscription = JSON.stringify({ body: 'test body' });
    const payload = JSON.stringify({ title: 'test' });
    webpush.sendNotification(subscription, payload).catch(error => {
        console.error(error.stack);
      });
}