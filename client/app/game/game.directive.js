'use strict';

angular.module('pirateGameApp')
  .directive('game', function () {
    return {
      templateUrl: 'app/game/game.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        var ourStar;
        var socket = io();
        var rando = getRandomInt();
        var onScreen = [];

        var player = {
          id: rando,
          name: 'George' + rando,
          x: 0,
          y: 0
        };

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
          //game.load.image('dude', 'star.png');
          game.load.image('dude', '../assets/images/yeoman.png');
        }

        function create() {
          ourStar = game.add.sprite(10, 0, 'dude');
        }

        socket.emit('player:joined', player);

        socket.on('player:joined', function(player){
          onScreen.push({id: player.id, sprite: addSprite(player)});

          //var notOnScreen = addPlayersNotOnScreenYet(allPlayers);
          //if (notOnScreen.length > 0) {
          //  _.forEach(notOnScreen, function(item) {
          //    onScreen.push({id: item.id, sprite: addSprite(item)});
          //  })
          //}
        });

        socket.on('player:updatePosition', function(allPlayers, play){
          var _allPlayers = allPlayers;
          onScreen[0].sprite.x += 20;
          onScreen[0].sprite.y += 20;



            //_.forEach(_allPlayers, function(item) {
            //  if (item.id === player.id) {
            //    updatePositionLocalUser(player);
            //  }
            //  _.forEach(onScreen, function(screen, key) {
            //    if (item.id === screen.id) {
            //      onScreen[key].x = item.x;
            //      onScreen[key].y = item.y;
            //    }
            //  })
            //})
        });

        function addPlayersNotOnScreenYet(players) {
          var _players = players;
          _.forEach(onScreen, function(screen) {
            _.forEach(_players, function(player, key) {
                if (player.id === screen.id && player.id !== rando) {
                  _players.splice(key, 1);
                }
            })
          });
          return _players;

        }


        scope.move = function(key) {
          //1. Move your guy
          //2. Broadcast to server - you moved
          movePositionLocalUser(key);
          broadcastPositionChange();
          game.update();
        }


        function broadcastPositionChange() {
          socket.emit('player:updatePosition', player);
        }

        function movePositionLocalUser(key) {
          ourStar.x += vectors[key].x;
          ourStar.y += vectors[key].y;
          updateObj(ourStar);
        }

        function updatePositionLocalUser(obj) {
          ourStar.x = obj.x;
          ourStar.y = obj.y;
          updateObj(ourStar);
        }

        function updateObj(obj) {
          player.x = obj.x;
          player.y = obj.y;
        }


        function getRandomInt() {
          var min = 1;
          var max = 100;
          return Math.floor(Math.random() * (max - min)) + min;
        }

        function addSprite(obj) {
          return game.add.sprite(obj.x, obj.y, 'dude');
        }

        

      }
    };
  });
