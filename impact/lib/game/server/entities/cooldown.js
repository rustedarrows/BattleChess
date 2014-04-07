ig.module(
    'game.server.entities.cooldown'
)
    .requires(
        'impact.entity',
        'impact.entity-pool',
        'plugins.server'
)
    .defines(function() {

        EntityCooldown = EntityServer.extend({

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.anim = 'run';
                this.cdTimer = new ig.Timer(3);
            },
            update: function() {
                this.parent();
                if(this.cdTimer.delta() > 0) {
                    this.kill();
                }
            },
            reset: function(x, y, settings) {
                this.parent(x, y, settings);
                this.anim = 'run';
                this.cdTimer = new ig.Timer(3);
            }
        });

        //ig.EntityPool.enableFor(EntityCooldown);

    });
