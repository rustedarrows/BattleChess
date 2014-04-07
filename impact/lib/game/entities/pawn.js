ig.module(
    'game.entities.pawn'
)
    .requires(
        'impact.entity',
        'game.entities.piece'
)
    .defines(function() {

        EntityPawn = EntityPiece.extend({

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('bPawn', 1, [3]);
                this.addAnim('wPawn', 1, [9]);
                if (this.team == 1) {
                    this.currentAnim = this.anims.wPawn;
                } else {
                    this.currentAnim = this.anims.bPawn;
                }
            }

        });


    });
