ig.module(
    'game.entities.king'
)
    .requires(
        'impact.entity',
        'game.entities.piece'
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
            }
        });


    });
