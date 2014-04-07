ig.module(
    'game.entities.cooldown'
)
    .requires(
        'impact.entity',
        'impact.entity-pool',
        'plugins.client'
)
    .defines(function() {

        EntityCooldown = EntityClient.extend({
            zIndex: -15,
            size: {
                x: 16,
                y: 64
            },

            animSheet: new ig.AnimationSheet('media/cooldown.png', 16, 64),
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('run', 0.3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], true);
                this.cdTimer = new ig.Timer(3);
            },
            reset: function(x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('run', 0.3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], true);
                this.currentAnim = this.anims.run;
            }
        });

        //ig.EntityPool.enableFor(EntityCooldown);

    });
