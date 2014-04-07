ig.module(
    'game.entities.rook'
)
    .requires(
        'impact.entity',
        'game.entities.piece'
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
            }
        });


    });
