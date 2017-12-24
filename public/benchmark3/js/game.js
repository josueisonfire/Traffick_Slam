var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('boot', bootState);
game.state.add('help', helpState);
game.state.add('controls', controlsState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('retry', retryState);
game.state.add('victory', victoryState);

var levelNum = 1;

//change to boot in final version maybe?
game.state.start('menu');
