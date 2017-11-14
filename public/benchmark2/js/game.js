var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('boot', bootState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('help', helpState);
game.start.add('control', controlState);

//change to boot in final version maybe?
game.state.start('menu');