ig.module(
    'game.entities.knight'
)
    .requires(
        'impact.entity',
        'game.entities.piece'
)
    .defines(function() {

        EntityKnight = EntityPiece.extend({

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim( 'bKnight', 1, [2] );
                this.addAnim( 'wKnight', 1, [8] );
                if(this.team == 1) {
                    this.currentAnim = this.anims.wKnight;
                } else {
                    this.currentAnim = this.anims.bKnight;
                }
            },
            clicked: function(other) {
                this.parent(other);
                if(this.team != other) {
                    return;
                }
                if (this.validateSpot(this.location.x + 2, this.location.y - 1)) {
                    this.spawnSpot(this.pos.x + 128, this.pos.y - 64);
                }
                if (this.validateSpot(this.location.x + 2, this.location.y + 1)) {
                    this.spawnSpot(this.pos.x + 128, this.pos.y + 64);
                }
                if (this.validateSpot(this.location.x + 1, this.location.y - 2)) {
                    this.spawnSpot(this.pos.x + 64, this.pos.y - 128);
                }
                if (this.validateSpot(this.location.x + 1, this.location.y + 2)) {
                    this.spawnSpot(this.pos.x + 64, this.pos.y + 128);
                }
                if (this.validateSpot(this.location.x - 2, this.location.y - 1)) {
                    this.spawnSpot(this.pos.x - 128, this.pos.y - 64);
                }
                if (this.validateSpot(this.location.x - 2, this.location.y + 1)) {
                    this.spawnSpot(this.pos.x - 128, this.pos.y + 64);
                }
                if (this.validateSpot(this.location.x - 1, this.location.y - 2)) {
                    this.spawnSpot(this.pos.x - 64, this.pos.y - 128);
                }
                if (this.validateSpot(this.location.x - 1, this.location.y + 2)) {
                    this.spawnSpot(this.pos.x - 64, this.pos.y + 128);
                }
            }
        });


    });
