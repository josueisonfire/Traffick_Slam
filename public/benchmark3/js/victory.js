var victoryState = {
    preload: function(){
        this.load.image('win', 'assets/retry.png');

    },
    create: function(){
        this.wScreen = this.add.sprite(game.camera.x,game.camera.y, 'win');
        this.wScreen.inputEnabled = true;
        this.wScreen.events.onInputDown.add(function(){
            game.state.start('play');
        }, this);
    }
};
