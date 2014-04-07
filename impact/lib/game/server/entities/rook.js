ig.module(
    'game.server.entities.rook'
)
    .requires(
        'impact.entity',
        'game.server.entities.piece'
)
    .defines(function() {

        EntityRook = EntityPiece.extend({

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim( 'bRook', 1, [5] );
                this.addAnim( 'wRook', 1, [11] );
                if(this.team == 1) {
                    this.currentAnim = this.anims.wRook;
                } else {
                    this.currentAnim = this.anims.bRook;
                }
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
                for(i = this.location.x; i > -1; i--) {
                    if (this.location.x != i) {
                        if (this.validateSpot(i, this.location.y)) {
                            this.spawnSpot(i * 64, this.pos.y);
                        } else {
                            break;
                        }
                    }
                }
                for(i = this.location.x; i < 8; i++) {
                    if (this.location.x != i) {
                        if (this.validateSpot(i, this.location.y)) {
                            this.spawnSpot(i * 64, this.pos.y);
                        } else {
                            break;
                        }
                    }
                }
                for(i = this.location.y; i > -1; i--) {
                    if (this.location.y != i) {
                        if (this.validateSpot(this.location.x, i)) {
                            this.spawnSpot(this.pos.x, i*64);
                        } else {
                            break;
                        }
                    }
                }
                for(i = this.location.y; i < 8; i++) {
                    if (this.location.y != i) {
                        if (this.validateSpot(this.location.x, i)) {
                            this.spawnSpot(this.pos.x, i*64);
                        } else {
                            break;
                        }
                    }
                }
            }
        });


    });
