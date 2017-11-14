var playState = {
    create: function(){
        this.createPlayer();
        //TODO:: createCars, createBackgrounds...
        
        //create one background for now
        this.background = this.add.sprite(0, 0, 'background');
        game.physics.arcade.enable(this.background);
        
        //cursor controls
        this.cursors = this.input.keyboard.createCursorKeys();
    },
    
    update: function(){
        this.playerMovement(); 
    },
    
    createPlayer: function(){
        this.player = game.add.sprite(this.world.centerX, this.world.centerY, 'player');   this.player.anchor.set(0.5);
        
        //track where the player started and track change in y distance
        this.player.yOrig = this.player.position.y;
        this.player.yChange = 0;
        
        //physics
        game.physics.arcade.enable(player);
        this.player.body.collideWorldBounds = true;
    },
    
    playerMovement: function(){/*
        if(this.cursors.up.isDown){
            this.player.body.velocity.y = -playerSpeed;
    }
    else if (cursors.down.isDown){
        player.body.velocity.y = playerSpeed;
    }
    else{
        player.body.velocity.y = 0;
    }
    if(cursors.left.isDown){
        player.body.velocity.x = -playerSpeed;  
    }
    else if(cursors.right.isDown){
        player.body.velocity.x = playerSpeed;
    }
    else{
        player.body.velocity.x = 0;
    }
    
    //track the maximum distance player has travelled
    player.yChange = Math.max(player.yChange, Math.abs(player.position.y - player.yOrig));
*/  };
}


