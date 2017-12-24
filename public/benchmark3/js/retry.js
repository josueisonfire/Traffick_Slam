var retryState = {
    preload: function(){
        this.load.image('retry', 'assets/retry.png');

    },
    create: function(){
        this.rScreen = this.add.sprite(game.camera.x,game.camera.y, 'retry');
        this.rScreen.inputEnabled = true;
        this.rScreen.events.onInputDown.add(function(){
            game.state.start('play');
        }, this);
    }
};
