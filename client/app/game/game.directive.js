'use strict';

angular.module('pirateGameApp')
  .directive('game', function (playerModel) {
    return {
      templateUrl: 'app/game/game.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        var socket = io();
        var uniqueId = getRandomInt();
        var onScreen = [];

        var vectors = {
          'left': { x: -10, y: 0 },
          'right': { x: 10, y: 0 },
          'up': { x: 0, y: -10 },
          'down': { x: 0, y: 10 }
        };

        var game =
          new Phaser.Game(
            800, 600,         // width x height
            Phaser.AUTO,      // the game context, 2D/3D
            'game_canvas',     // id of the DOM element to add the game
            { preload: preload, create: create, update: function() {} }
          );

        function preload() {
          game.load.image('dude', '../assets/images/yeoman.png');
        }

        function create() {
          var temp = new playerModel(uniqueId, addSprite());
          onScreen.push({id: temp.id, sprite: temp});
        }

        console.log(uniqueId);

        socket.emit('player:joined', {id: uniqueId});
        //setup ends ...


        socket.on('player:newPlayer', function(allPlayers){
          //1. our own player can get added twice
          var _allPlayers = allPlayers;
          _.forEach(_allPlayers, function(obj) {
            if (!isOnScreen(obj.id)) {
              var temp = new playerModel(obj.id, addSprite());
              onScreen.push({id: temp.id, sprite: temp});
            }
          })
        });

        function isOnScreen(id) {
          var _id = id;
          var result = false;
          _.forEach(onScreen, function(item) {
            if (item.id === _id) {
              result = true;
            }
          });
          return result;
        }

        function findCurrentIndex(array, id) {
          var result = _(array)
            .map(function(el, index) { if (el.id === id) {return index;}})
            .filter(function(el) {return el !== undefined;})
            .value();
          return result[0];
        }

        socket.on('player:updatePosition', function(allPlayers, updatedPlayer){
          var _allPlayers = allPlayers;
          var updated = onScreen[findCurrentIndex(onScreen, updatedPlayer.id)];
          updated.sprite.updatePosition(updatedPlayer.x, updatedPlayer.y);
        });

        //State on one side --
          //data living in once place
          //pre-
        //TODO Understand State
        //GOAL: Effcient of updating players




        scope.move = function(key) {
          var index = findCurrentIndex(onScreen, uniqueId);

          if (index >= 0) {
            updatePosition(key, index);
          }
        }

        function updatePosition(key, index) {
          //Check if we can move
          var update = {id: uniqueId, x: vectors[key].x, y: vectors[key].y};
          onScreen[index].sprite.updatePosition(update.x, update.y);
          broadcastPositionChange(update);
          game.update(); //???
        }



        socket.on('rejected', function(newCoordinates) {

        })



        function broadcastPositionChange(player) {
          console.log(player.id === uniqueId, player.id);
          socket.emit('player:updatePosition', player);
        }

        function getRandomInt() {
          var min = 1;
          var max = 100;
          return Math.floor(Math.random() * (max - min)) + min;
        }

        function addSprite() {
          return game.add.sprite(10, getRandomInt(), 'dude');
        }



      }
    };
  });
