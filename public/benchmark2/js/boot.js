var bootState = {
    create: function(){
        //start physics engine
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //call the load state
        game.state.start('load');
    }
};