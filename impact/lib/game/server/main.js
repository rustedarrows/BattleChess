ig.module(
    'game.server.main'
)
    .requires(
        'plugins.server',
        'game.levels.chessboard',
        'game.server.entities.pawn',
        'game.server.entities.rook',
        'game.server.entities.knight',
        'game.server.entities.bishop',
        'game.server.entities.queen',
        'game.server.entities.king',
        'game.server.entities.pointer',
        'game.server.entities.piece'
)
    .defines(function() {

        // This handles all the network logic and is now seperated from the game class.
        // You can access this instance at ig.server.
        MyServer = Server.extend({
            clientConnected: function(socket) {
                this.parent(socket);
                if (ig.game.getEntitiesByType(EntityPointer).length === 0) {
                    ig.game.spawnEntity(EntityPointer, 64, 64, {
                        socket: socket,
                        team: 1
                    });
                } else if(ig.game.getEntitiesByType(EntityPointer)[0].team == 1){
                    ig.game.spawnEntity(EntityPointer, 64, 64, {
                        socket: socket,
                        team: 2
                    });
                } else if(ig.game.getEntitiesByType(EntityPointer)[0].team == 2){
                     ig.game.spawnEntity(EntityPointer, 64, 64, {
                        socket: socket,
                        team: 1
                    });
                }
            },




        });

        MyGame = GameServer.extend({
            init: function() {
                this.loadLevel(LevelChessboard);
                this.board = [];
                for (var i = 0; i < 8; i++) {
                    this.board[i] = [];
                    for (var j = 0; j < 8; j++) {
                        this.board[i][j] = 0;
                    }
                }
                this.resetTimer = new ig.Timer(0);
                this.resetBoard();
            },
            resetBoard: function() {
                for (var i = 0; i < 8; i++) {
                    ig.game.spawnEntity(EntityPawn, i * 64, 6 * 64, {
                        team: 1
                    });
                    ig.game.spawnEntity(EntityPawn, i * 64, 1 * 64, {
                        team: 2
                    });
                }
                ig.game.spawnEntity(EntityQueen, 3*64, 7*64, {
                    team: 1
                });
                ig.game.spawnEntity(EntityKing, 4*64, 7*64, {
                    team: 1
                });
                ig.game.spawnEntity(EntityBishop, 5*64, 7*64, {
                    team: 1
                });
                ig.game.spawnEntity(EntityBishop, 2*64, 7*64, {
                    team: 1
                });
                ig.game.spawnEntity(EntityKnight, 1*64, 7*64, {
                    team: 1
                });
                ig.game.spawnEntity(EntityKnight, 6*64, 7*64, {
                    team: 1
                });
                ig.game.spawnEntity(EntityRook, 7*64, 7*64, {
                    team: 1
                });
                ig.game.spawnEntity(EntityRook, 0, 7*64, {
                    team: 1
                });

                ig.game.spawnEntity(EntityQueen, 3*64, 0*64, {
                    team: 2
                });
                ig.game.spawnEntity(EntityKing, 4*64, 0*64, {
                    team: 2
                });
                ig.game.spawnEntity(EntityBishop, 5*64, 0*64, {
                    team: 2
                });
                ig.game.spawnEntity(EntityBishop, 2*64, 0*64, {
                    team: 2
                });
                ig.game.spawnEntity(EntityKnight, 1*64, 0*64, {
                    team: 2
                });
                ig.game.spawnEntity(EntityKnight, 6*64, 0*64, {
                    team: 2
                });
                ig.game.spawnEntity(EntityRook, 7*64, 0*64, {
                    team: 2
                });
                ig.game.spawnEntity(EntityRook, 0, 0*64, {
                    team: 2
                });
            }
        });

        ig.main('#canvas', MyGame, 60, 320, 240, 2);
        ig.system.setServer(MyServer);

    });
