ig.module(
    'game.entities.bishop'
)
    .requires(
        'impact.entity',
        'game.entities.piece'
)
    .defines(function() {

        EntityBishop = EntityPiece.extend({
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('bBishop', 1, [0]);
                this.addAnim('wBishop', 1, [6]);
                if (this.team == 1) {
                    this.currentAnim = this.anims.wBishop;
                } else {
                    this.currentAnim = this.anims.bBishop;
                }
            },

        });


    });
