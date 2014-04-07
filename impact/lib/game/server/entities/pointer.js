ig.module(
    'game.server.entities.pointer'
)
    .requires(
        'impact.entity',
        'plugins.server'
)
    .defines(function() {

        EntityPointer = EntityServer.extend({
            checkAgainst: ig.Entity.TYPE.B,
            size: {
                x: 1,
                y: 1
            },
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.input.bind(ig.KEY.MOUSE1, 'click');
                this.team = settings.team;
            },
            update: function() {
                this.parent();
                this.pos.x = this.input.mouse.x;
                this.pos.y = this.input.mouse.y;

            },

            check: function(other) {
                if (this.input.state('click') && typeof(other.clicked) == 'function') {
                    other.clicked(this.team);
                }
            }
        });


    });
