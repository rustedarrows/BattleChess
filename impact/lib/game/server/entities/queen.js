ig.module(
    'game.server.entities.queen'
)
    .requires(
        'impact.entity',
        'game.server.entities.piece'
)
    .defines(function() {

        EntityQueen = EntityPiece.extend({

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('bQueen', 1, [4]);
                this.addAnim('wQueen', 1, [10]);
                if (this.team == 1) {
                    this.currentAnim = this.anims.wQueen;
                } else {
                    this.currentAnim = this.anims.bQueen;
                }
            },

            clicked: function(other) {
                this.parent(other);
                if(this.team != other) {
                    return;
                }
                this.updateSpots();

            },
            updateSpots: function() {
                this.parent();
                for(i = this.location.x; i > -1; i--) {
                    if (this.location.x != i) {
                        if (this.validateSpot(i, this.location.y)) {
                            this.spawnSpot(i * 64, this.pos.y);
                        } else {
                            break;
                        }
                    }
                }
                for(i = this.location.x; i < 8; i++) {
                    if (this.location.x != i) {
                        if (this.validateSpot(i, this.location.y)) {
                            this.spawnSpot(i * 64, this.pos.y);
                        } else {
                            break;
                        }
                    }
                }
                for(i = this.location.y; i > -1; i--) {
                    if (this.location.y != i) {
                        if (this.validateSpot(this.location.x, i)) {
                            this.spawnSpot(this.pos.x, i*64);
                        } else {
                            break;
                        }
                    }
                }
                for(i = this.location.y; i < 8; i++) {
                    if (this.location.y != i) {
                        if (this.validateSpot(this.location.x, i)) {
                            this.spawnSpot(this.pos.x, i*64);
                        } else {
                            break;
                        }
                    }
                }
                var height = this.location.y;
                for (i = this.location.x; i < 8; i++) {
                    if (this.location.x == i) {

                    } else {
                        if (this.validateSpot(i, height)) {
                            this.spawnSpot(i * 64, height * 64);
                        } else {
                            break;
                        }
                    }
                    height++;
                }
                height = this.location.y;
                for (i = this.location.x; i > -1; i--) {
                    if (this.location.x == i) {

                    } else {
                        if (this.validateSpot(i, height)) {
                            this.spawnSpot(i * 64, height * 64);
                        } else {
                            break;
                        }
                    }
                    height++;
                }
                height = this.location.y;
                for (i = this.location.x; i < 9; i++) {
                    if (this.location.x == i) {

                    } else {
                        if (this.validateSpot(i, height)) {
                            this.spawnSpot(i * 64, height * 64);
                        } else {
                            break;
                        }
                    }
                    height--;
                }
                height = this.location.y;
                for (i = this.location.x; i > -1; i--) {
                    if (this.location.x == i) {

                    } else {
                        if (this.validateSpot(i, height)) {
                            this.spawnSpot(i * 64, height * 64);
                        } else {
                            break;
                        }
                    }
                    height--;
                }
            }
        });


    });
