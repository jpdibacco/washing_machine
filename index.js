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

//added dirty db:
var dirty = require('dirty');
var db = dirty('user.db');
//washing machine status:
var status = true;
io.on('connection', function (socket) {
  console.log('a user connected');
});
http.listen(PORT, function () {
  console.log('listening on *:3000');
});
//change countdown for general variable:
var countdown;
function clearCounter(what) {
  clearInterval(what);
}
io.sockets.on('connection', function (socket) {
  socket.on('reset', function (data) {
    countdown = 10;
    io.sockets.emit('timer', { countdown: countdown });

  });
  io.sockets.emit('status', { status: status });
});
var settimerFunction = function(){
  setInterval(function () {
    countdown--;
    io.sockets.emit('timer', { countdown: countdown });
    io.sockets.emit('status', { status: status });
    console.log('countdown: ', countdown);
    if (countdown == 0) {
      console.log('countdown is 0');
      console.log('suscription is:', pushSubscriptionTest);
      //webpush.sendNotification(pushSubscriptionTest, JSON.stringify({ title: 'real push!' }));
      clearCounter(this);
      status = true;
      io.sockets.emit('status', { status: status });
    }
  }, 1000);
}
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
var userName;
app.post('/user', function (req, res) {
  var datainfo;
  console.log('user is: ', req.body);
  userName = req.body.name;
  db.set('user', { name: userName });
  console.log('Added user, he has name: ', db.get('user').name);
  res.send('ok');
});
app.get('/showlast', function (req, res) {
  console.log('Last user, he/she has name:.', db.get('user').name);
  var usersend = db.get('user').name;
  //res.send('last');
  res.send(usersend);
});
app.post('/time', function (req, res) {
  console.log('time is: ', req.body);
  countdown = req.body.time;
  status = false;
  settimerFunction();
  console.log('time is:', countdown);
  res.send('ok time!');
});