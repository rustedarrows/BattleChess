ig.module(
    'game.server.entities.bishop'
)
    .requires(
        'impact.entity',
        'game.server.entities.piece'
)
    .defines(function() {

        EntityBishop = EntityPiece.extend({
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('bBishop', 1, [0]);
                this.addAnim('wBishop', 1, [6]);
                if (this.team == 1) {
                    this.currentAnim = this.anims.wBishop;
                } else {
                    this.currentAnim = this.anims.bBishop;
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
                    if (this.location.x != i) {
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
