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
        this.background2 = this.add.sprite(0, -600, 'background');
        game.physics.arcade.enable(this.background);
        game.physics.arcade.enable(this.background2);
        
        //create player character
        this.createPlayer();
        
        //cursor controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        //camera tracking var
        this.cameraYMin = 99999;
    },
    
    update: function(){
        this.playerMovement();
        //debug stuff TODO:: erase
        game.debug.text("YChange: " + this.player.yChange, 32, 32);
        game.debug.text("Y:       " + this.player.y, 32, 64);
        game.debug.text("cameraYMIN: "+this.cameraYMin, 32, 96);
        game.debug.text("yOrig:   " + this.player.yOrig, 32, 120);
        game.debug.text("this.game.height: "+this.game.height, 32, 140);
        
        //The height of the world is adjusted to match the furthest the player has reached.
        this.world.setBounds(0, -this.player.yChange, this.world.width, this.game.height + this.player.yChange);
        
        //custom camera follow; only moves up
        this.cameraYMin = Math.min(this.cameraYMin, this.player.y - this.game.height + 130);
        this.camera.y = this.cameraYMin;
    },
    
    createPlayer: function(){
        this.player = game.add.sprite(this.world.centerX, this.world.centerY, 'player');   this.player.anchor.set(0.5);
        this.player.maxSpeed = 300;
        
        //variables to track where the player started and track change in y distance
        this.player.yOrig = this.player.y;
        this.player.yChange = 0;
        
        //player physics
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
        //TODO:: slow down diagonal movements --by a factor of 1/sqrt(2)?--
    
    //track the maximum distance player has traveled
    this.player.yChange = Math.max(this.player.yChange, Math.abs(this.player.y - this.player.yOrig));
  }
};


