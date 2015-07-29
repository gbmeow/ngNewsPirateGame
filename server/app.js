/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var Player = require('./models/players');

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
//TODO Start using
  //https://github.com/creationix/nvm
//TODO JASMINE test
  //stab out sockets
//NEXTITME ES6 w/ Ari
  //TODO Read http://babeljs.io/docs/setup/#grunt
//TODO Setup Webpack

io.sockets.on('connection', function (socket) {
  socket.on('player:joined', function(player){
    var player = new Player(player);
    players.push(player);
    var excluded = allButPlayer(players, player);
    io.emit('player:newPlayer', excluded);
  });

  socket.on('player:updatePosition', function(json){

    var foundUser = findUser(players, json);

    if(foundUser)
      foundUser.updatePosition(json);

    //if (foundUser >= 0) {
    //  players[foundUser].x += player.x;
    //  players[foundUser].y += player.y;
      io.emit('player:updatePosition', players);
    //}
  });

});



function findUser(array, json) {
  var found = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i].id === json.id) {
      found = array[i];
      break;
    }
  }
  return found;
}

function allButPlayer(arr, json) {
  var foundPlayers = [];
  for (var i = 0; i < array.length; i++) {
    if (array[i].id !== json.id) {
      foundPlayers.push(array[i]);
    }
  }
  return foundPlayers;
}

// Expose app
exports = module.exports = app;
