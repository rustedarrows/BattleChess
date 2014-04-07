ig.module(
    'game.main'
)
    .requires(
        'impact.game',
        'impact.font',

        'game.entities.pawn',
        'game.entities.rook',
        'game.entities.knight',
        'game.entities.bishop',
        'game.entities.queen',
        'game.entities.king',
        'game.entities.pointer',

        'game.levels.chessboard',
        'impact.debug.debug'
)
    .defines(function() {


        // Our Main Game class. This will load levels, host all entities and
        // run the game.

        MyClient = Client.extend({
        });

        MyGame = GameClient.extend({
            init: function() {
                this.loadLevel(LevelChessboard);
            }
        });

        ig.main('#canvas', MyGame, 60, 512, 512, 1);
        ig.system.setClient(MyClient);


    });
