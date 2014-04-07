ig.module(
    'game.server.entities.piece'
)
    .requires(
        'impact.entity',
        'game.server.entities.validspot',
        'plugins.server'
)
    .defines(function() {

        EntityPiece = EntityServer.extend({

            // The players (collision) size is a bit smaller than the animation
            // frames, so we have to move the collision box a bit (offset)
            size: {
                x: 64,
                y: 64
            },
            location: {
                x: 0,
                y: 0
            },
            team: 0,
            type: ig.Entity.TYPE.B,
            animSheet: new ig.AnimationSheet('media/spritechess.png', 64, 64),

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.team = settings.team;
                this.moveTimer = new ig.Timer();
            },


            update: function() {
                this.location.x = this.pos.x / 64;
                this.location.y = this.pos.y / 64;
                ig.game.board[this.location.x][this.location.y] = this;
                //this.updateSpots();
            },
            clicked: function(other) {
                if (this.team != other) {
                    return;
                }
                this.clearSpots();
            },
            clearSpots: function() {
                var spots = ig.game.getEntitiesByType(EntityValidspot);
                for (var i = 0; i < spots.length; i++) {
                    if (spots[i].team == this.team) {
                        spots[i].kill();
                    }
                }
            },
            spawnSpot: function(x, y) {
                spot = ig.game.spawnEntity(EntityValidspot, x, y, {
                    team: this.team
                });
                spot.piece = this;
                spot.team = this.team;
            },
            validateSpot: function(x, y) {
                if (x > 7 || x < 0 || y > 7 || y < 0) {
                    return false;
                }
                if (ig.game.board[x][y] !== 0) {
                    if (this.isEnemy(x, y)) {
                        spot = ig.game.spawnEntity(EntityValidspot, x * 64, y * 64, {
                            team: this.team
                        });
                        spot.currentAnim = spot.anims.enemy;
                        spot.enemy = true;
                        spot.piece = this;
                        spot.team = this.team;
                    }
                    return false;
                }
                return true;
            },
            isEnemy: function(x, y) {
                if (ig.game.board[x][y].team != this.team) {
                    return true;
                }
                return false;
            },
            updateSpots: function() {
                this.clearSpots();
            }
        });


    });
