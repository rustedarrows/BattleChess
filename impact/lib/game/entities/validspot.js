ig.module(
    'game.entities.validspot'
)
    .requires(
        'impact.entity',
        'impact.entity-pool',
        'game.entities.cooldown',
        'plugins.client'
)
    .defines(function() {

        EntityValidspot = EntityClient.extend({
            zIndex: -10,
            size: {
                x: 64,
                y: 64
            },

            animSheet: new ig.AnimationSheet('media/validspot.png', 64, 64),

            type: ig.Entity.TYPE.B,
            piece: null,
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0]);
                this.addAnim('enemy', 1, [1]);
            },
            update: function() {
                this.parent();
                if(this.anim == 'enemy') {
                    this.currentAnim = this.anims.enemy;
                }
            },
            draw: function() {
                if(this.team == ig.game.team) {
                    this.parent();
                }
            }
        });

    });
