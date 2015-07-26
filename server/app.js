/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});

require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);
require('lodash');

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

var io = require('socket.io').listen(server);

var players = [];
io.sockets.on('connection', function (socket) {
  socket.on('player:joined', function(player){
    player.x = 0;
    player.y = 0;
    players.push(player);
    io.emit('player:newPlayer', players);
  });

  socket.on('player:updatePosition', function(player){
    var foundUser = findUser(players, player);
    console.log('before', players[foundUser].x);
    console.log(player.x);
    if (foundUser >= 0) {
      players[foundUser].x += player.x;
      players[foundUser].y += player.y;
      console.log('after', players[foundUser].x);
      io.emit('player:updatePosition', players, players[foundUser]);
    }
  });

});

function findUser(array, player) {
  var found = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i].id === player.id) {
      found = i;
    }
  }
  return found;
}

// Expose app
exports = module.exports = app;
