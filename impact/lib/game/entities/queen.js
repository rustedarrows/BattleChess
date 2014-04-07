ig.module(
    'game.entities.queen'
)
    .requires(
        'impact.entity',
        'game.entities.validspot',
        'game.entities.piece'
)
    .defines(function() {

        EntityQueen = EntityPiece.extend({

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('bQueen', 1, [4]);
                this.addAnim('wQueen', 1, [10]);
                if (this.team == 1) {
                    this.currentAnim = this.anims.wQueen;
                } else {
                    this.currentAnim = this.anims.bQueen;
                }
            }
        });


    });
