ig.module(
    'game.server.entities.validspot'
)
    .requires(
        'impact.entity',
        'impact.entity-pool',
        'game.server.entities.cooldown',
        'plugins.server'
)
    .defines(function() {

        EntityValidspot = EntityServer.extend({
            zIndex: -10,
            size: {
                x: 64,
                y: 64
            },

            animSheet: new ig.AnimationSheet('media/validspot.png', 64, 64),

            type: ig.Entity.TYPE.B,
            piece: null,
            enemy: false,
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0]);
                this.addAnim('enemy', 1, [1]);
                this.currentAnim = this.anims.idle;
                this.team = settings.team;
            },
            clicked: function(other) {
                if (this.piece.moveTimer.delta() > 0 && this.piece.team == other) {
                    ig.game.board[this.piece.location.x][this.piece.location.y] = 0;
                    if(ig.game.board[this.pos.x/64][this.pos.y/64] !== 0) {
                        ig.game.board[this.pos.x/64][this.pos.y/64].kill();
                    }
                    this.piece.pos.x = this.pos.x;
                    this.piece.pos.y = this.pos.y;
                    this.piece.moveTimer.set(3);
                    ig.game.spawnEntity(EntityCooldown, this.piece.pos.x, this.piece.pos.y);
                    this.piece.clearSpots();
                }
            },
            update: function() {
                this.parent();
                if(this.enemy) {
                    this.anim = 'enemy';
                }
            }
        });

        //ig.EntityPool.enableFor(EntityValidspot);

    });
