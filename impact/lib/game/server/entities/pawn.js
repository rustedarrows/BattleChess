ig.module(
    'game.server.entities.pawn'
)
    .requires(
        'impact.entity',
        'game.server.entities.piece'
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
            },


            clicked: function(other) {
                this.parent(other);
                if (this.team != other) {
                    return;
                }
                this.updateSpots();


            },
            updateSpots: function() {
                this.parent();
                if (this.team == 1) {
                    if (this.validateSpot(this.location.x, this.location.y - 1)) {
                        if (this.validateSpot(this.location.x, this.location.y - 2) && this.location.y == 6) {
                            this.spawnSpot(this.pos.x, this.pos.y - 128);
                        }
                        this.spawnSpot(this.pos.x, this.pos.y - 64);
                    }
                    if (this.isEnemy(this.location.x - 1, this.location.y - 1)) {
                        spot = ig.game.spawnEntity(EntityValidspot, (this.location.x - 1) * 64, (this.location.y - 1) * 64, {
                            team: this.team
                        });
                        spot.currentAnim = spot.anims.enemy;
                        spot.enemy = true;
                        spot.piece = this;
                        spot.team = this.team;
                    }
                    if (this.isEnemy(this.location.x + 1, this.location.y - 1)) {
                        spot = ig.game.spawnEntity(EntityValidspot, (this.location.x + 1) * 64, (this.location.y - 1) * 64, {
                            team: this.team
                        });
                        spot.currentAnim = spot.anims.enemy;
                        spot.enemy = true;
                        spot.piece = this;
                        spot.team = this.team;
                    }
                } else {
                    if (this.validateSpot(this.location.x, this.location.y + 1)) {
                        if (this.validateSpot(this.location.x, this.location.y + 2) && this.location.y == 1) {
                            this.spawnSpot(this.pos.x, this.pos.y + 128);
                        }
                        this.spawnSpot(this.pos.x, this.pos.y + 64);
                    }
                    if (this.isEnemy(this.location.x - 1, this.location.y + 1)) {
                        spot = ig.game.spawnEntity(EntityValidspot, (this.location.x - 1) * 64, (this.location.y + 1) * 64, {
                            team: this.team
                        });
                        spot.currentAnim = spot.anims.enemy;
                        spot.enemy = true;
                        spot.piece = this;
                        spot.team = this.team;
                    }
                    if (this.isEnemy(this.location.x + 1, this.location.y + 1)) {
                        spot = ig.game.spawnEntity(EntityValidspot, (this.location.x + 1) * 64, (this.location.y + 1) * 64, {
                            team: this.team
                        });
                        spot.currentAnim = spot.anims.enemy;
                        spot.enemy = true;
                        spot.piece = this;
                        spot.team = this.team;
                    }
                }
            },
            validateSpot: function(x, y) {
                if (x > 7 || x < 0 || y > 7 || y < 0) {
                    return false;
                }
                if (ig.game.board[x][y] !== 0) {
                    return false;
                }
                return true;
            },
            isEnemy: function(x, y) {
                if (x > 7 || x < 0 || y > 7 || y < 0) {
                    return false;
                }
                if (ig.game.board[x][y] !== 0) {
                    if (ig.game.board[x][y].team != this.team) {
                        return true;
                    }
                }

                return false;
            }
        });


    });
