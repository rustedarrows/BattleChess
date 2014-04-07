ig.module(
    'game.server.entities.king'
)
    .requires(
        'impact.entity',
        'game.server.entities.piece'
)
    .defines(function() {

        EntityKing = EntityPiece.extend({
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('bKing', 1, [1]);
                this.addAnim('wKing', 1, [7]);
                if (this.team == 1) {
                    this.currentAnim = this.anims.wKing;
                } else {
                    this.currentAnim = this.anims.bKing;
                }
            },

            kill: function() {
                this.parent();
                //ig.game.resetBoard();
            },
            clicked: function(other) {
                this.parent(other);
                if(this.team != other) {
                    return;
                }
                this.updateSpots();

            },
            updateSpots: function() {
                this.parent();
                if (this.validateSpot(this.location.x + 1, this.location.y + 1)) {
                    this.spawnSpot(this.pos.x + 64, this.pos.y + 64);
                }
                if (this.validateSpot(this.location.x + 1, this.location.y)) {
                    this.spawnSpot(this.pos.x + 64, this.pos.y);
                }
                if (this.validateSpot(this.location.x, this.location.y + 1)) {
                    this.spawnSpot(this.pos.x, this.pos.y + 64);
                }
                if (this.validateSpot(this.location.x - 1, this.location.y - 1)) {
                    this.spawnSpot(this.pos.x - 64, this.pos.y - 64);
                }
                if (this.validateSpot(this.location.x - 1, this.location.y)) {
                    this.spawnSpot(this.pos.x - 64, this.pos.y);
                }
                if (this.validateSpot(this.location.x, this.location.y - 1)) {
                    this.spawnSpot(this.pos.x, this.pos.y - 64);
                }
                if (this.validateSpot(this.location.x + 1, this.location.y - 1)) {
                    this.spawnSpot(this.pos.x + 64, this.pos.y - 64);
                }
                if (this.validateSpot(this.location.x - 1, this.location.y + 1)) {
                    this.spawnSpot(this.pos.x - 64, this.pos.y + 64);
                }
            }
        });


    });
