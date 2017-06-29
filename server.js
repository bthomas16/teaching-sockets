var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = {};
var connections = [];

var port = process.env.PORT || 3000

server.listen(port)
console.log('servering running on ' + '' + `${port}` );

app.get('/', function(req,res) {
  res.sendFile(__dirname + '/index.html')
})

// Initialize Socket.io library on front end


io.sockets.on('connection', function(socket) {
  socket.join('mainRoom')
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  // Handle disconnecting users

  socket.on('disconnect', function(data){
    delete users[socket.username]
    updateUsernames();
  });

  // Handle client-side message send

  socket.on('send message', function(data, callback){
    // var message = data.trim()
    // if(message.substr(0,3) === '/w ') {
    //   message = message.substr(3);
    //   var ind = message.indexOf(' ');
    //   if(ind !== -1) {
    //     var name = message.substr(0, ind);
    //     var message = message.substr(ind + 1)
    //     if(name in users) {
    //       users[name].emit('whisper',
    //        {
    //         msg: message,
    //         user: socket.username
    //       })
    //       console.log('whisper!');
    //     } else {
    //       callback('Error! Enter a valid user.')
    //     }
    //   } else {
    //     callback('Error! Please enter a message for your whisper.')
    //     }
    //   } else {

    // Handle server-side message response

    io.sockets.emit('new message', {msg: message, user: socket.username
    })
  })


  // new user & handlebars uname

  socket.on('new user', function(data, callback) {
    if(data in users) {
      callback(false)
    } else {
    callback(true);
    socket.username = data;
    users[socket.username] = socket;
    updateUsernames()
    }
  });

// Update User names array

  function updateUsernames() {
    io.sockets.emit('get users', Object.keys(users));
  }

})
