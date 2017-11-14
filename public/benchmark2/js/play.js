var playState = {
    preload: function(){
        //load all assets
        this.load.image('background', 'assets/background.png');
        this.load.spritesheet('player', 'assets/dude.png', 32, 48);
    },
    
    create: function(){
        //TODO:: createCars, createBackgrounds...
        
        //create one background for now
        this.background = this.add.sprite(0, 0, 'background');
        game.physics.arcade.enable(this.background);
        
        //create player character
        this.createPlayer();
        
        //cursor controls
        this.cursors = this.input.keyboard.createCursorKeys();
    },
    
    update: function(){
        this.playerMovement();
        game.debug.text(this.player.body.velocity.y, 32, 32);
    },
    
    createPlayer: function(){
        this.player = game.add.sprite(this.world.centerX, this.world.centerY, 'player');   this.player.anchor.set(0.5);
        this.player.maxSpeed = 300;
        
        //track where the player started and track change in y distance
        this.player.yOrig = this.player.position.y;
        this.player.yChange = 0;
        
        //physics
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
    },
    
    playerMovement: function(){
        var inc = 20;
        var slow = 0.9;
        if(this.cursors.up.isDown && this.player.body.velocity.y > -this.player.maxSpeed){
            this.player.body.velocity.y -= inc;
        }
        else if (this.cursors.down.isDown && this.player.body.velocity.y < this.player.maxSpeed){
            this.player.body.velocity.y += inc;
        }
        else{
            //slowing down; friction-like effect
            this.player.body.velocity.y *= slow;
            //stop entirely when velocity is too small
            if (this.player.body.velocity.y < inc && this.player.body.velocity.y > -inc)
                this.player.body.velocity.y = 0;
        }
        if(this.cursors.left.isDown && this.player.body.velocity.x > -this.player.maxSpeed){
            this.player.body.velocity.x -= inc;  
        }
        else if(this.cursors.right.isDown && this.player.body.velocity.x < this.player.maxSpeed){
            this.player.body.velocity.x += inc;
        }
        else{
            //slowing down; friction-like effect
            this.player.body.velocity.x *= slow;
            //stop entirely when velocity is too small
            if (this.player.body.velocity.x < inc && this.player.body.velocity.x > -inc)
                this.player.body.velocity.x = 0;
        }
    
    //track the maximum distance player has travelled
    this.player.yChange = Math.max(this.player.yChange, Math.abs(this.player.position.y - this.player.yOrig));
  }
};


