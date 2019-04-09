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
var pushSubscriptionTest; //your subscription object
// This is the same output of calling JSON.stringify on a PushSubscription
webpush.setVapidDetails('mailto:patricio.dibacco@acrovia.net', publicVapidKey, privateVapidKey);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
  console.log('a user connected');
});
http.listen(PORT, function () {
  console.log('listening on *:3000');
});
var countdown = 10;
setInterval(function () {
  countdown--;
  io.sockets.emit('timer', { countdown: countdown });
  console.log('countdown: ', countdown);
  if (countdown == 0) {
    console.log('countdown is 0');
    console.log('suscription is:', pushSubscriptionTest);
    //webpush.sendNotification(pushSubscriptionTest, JSON.stringify({ title: 'real push!' }));
    //clearCounter();
  }
}, 1000);
function clearCounter(){
  clearInterval(this);
}
io.sockets.on('connection', function (socket) {
  socket.on('reset', function (data) {
    countdown = 10;
    io.sockets.emit('timer', { countdown: countdown });
  });
});
//web-push:
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  pushSubscriptionTest = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: 'Washing Machine' });

  console.log(subscription);

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
});