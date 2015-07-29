'use strict';

angular.module('pirateGameApp')
  .factory('playerModel', function () {
    // Service logic
    // ...
    var Player = function(id, obj) {
      this.id = id;
      this.name = 'George' + id;
      this.phaserInstance = obj;
      this.x = obj.x;
      this.y = obj.y;
    }

    Player.prototype.createSuggestedPosition = function(x, y) {
      var newX = this.x + x,
        newY = this.y + y;
      return {
        x: newX,
        y: newY
      }
      //this.phaserInstance.x += x;
      //this.phaserInstance.y += y;
    }

    //TODO Prefabs
    //https://github.com/fullstackio/ng-game/blob/master/client/src/scripts/game/entities/player.js

    //TODO Make this work -- as Ari exlained
    Player.prototype.updatePosition = function(json) {
      this.phaserInstance.x = json.x;
      this.phaserInstance.y = json.y;
    }

    return Player;
  });
