require('dotenv').config();
var express = require('express');
var path = require('path');
var app = express();
var router = express.Router();
const PORT = process.env.PORT || 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); 
var qs = require('querystring');
var that = this;
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
    clearCounter(this);
  }
}, 1000);
function clearCounter(what) {
  clearInterval(what);
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
// save username:
app.post('/user', function (req, res) {
  var datainfo;
  console.log('user is: ', req.body);
  res.send('ok');
})