ig.module(
    'game.entities.pointer'
)
    .requires(
        'impact.entity',
        'plugins.client'
)
    .defines(function() {

        EntityPointer = EntityClient.extend({
            checkAgainst: ig.Entity.TYPE.B,
            size: {
                x: 1,
                y: 1
            },
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                console.log(this.team);
                ig.input.bind(ig.KEY.MOUSE1, 'click');
                console.log(this.owner);
                if (ig.client.socket.socket.sessionid == this.owner) {
                    ig.game.team = this.team;
                }
            }
        });


    });
