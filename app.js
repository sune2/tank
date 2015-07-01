var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

app.use(express.static('public'));

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
