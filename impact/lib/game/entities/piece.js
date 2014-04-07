ig.module(
    'game.entities.piece'
)
    .requires(
        'impact.entity',
        'game.entities.validspot',
        'plugins.client'
)
    .defines(function() {

        EntityPiece = EntityClient.extend({

            // The players (collision) size is a bit smaller than the animation
            // frames, so we have to move the collision box a bit (offset)
            size: {
                x: 64,
                y: 64
            },
            location: {
                x: 0,
                y: 0
            },
            team: 0,
            type: ig.Entity.TYPE.B,
            animSheet: new ig.AnimationSheet('media/spritechess.png', 64, 64),

            init: function(x, y, settings) {
                this.parent(x, y, settings);
            },
        });


    });
