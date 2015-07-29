/**
 * Created by jerzybatalinski on 2015-07-28.
 */

var Player = function(config) {
  this.id       = config.id || '';
  this.name     = config.name || 'Player';
  this.x = 0;
  this.y = 0;
  //TODO
    //ADD Health, Rotation, Points - store in Mongo
  this.health   = 10;
  this.points   = 0;
  return this;
}

Player.prototype.updatePosition = function(json) {
  this.x = json.x;
  this.y = json.y;
}

module.exports = Player;
