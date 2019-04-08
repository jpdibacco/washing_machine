var app = require('express')();
var http = require('http').Server(app);
app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/css'));
app.use('/client',express.static(__dirname + '/js'));
// app.get('/', function(req, res){
//   res.send('<h1>Hello world</h1>');
// });

http.listen(3000, function(){
  console.log('listening on *:3000');
});