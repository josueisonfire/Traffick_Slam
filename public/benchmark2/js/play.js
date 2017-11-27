var playState = {
    preload: function(){
        //load all assets
        this.load.image('background', 'assets/background.png');
        this.load.spritesheet('player', 'assets/dude.png', 32, 48);
    },
    
    create: function(){
        this.backgroundCounter = 0;
        //TODO:: createCars, createBackgrounds...
        
        //create background images to repeat
        this.createBackground();
        
        //create player character
        this.createPlayer();
        
        //cursor controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
    },
    
    update: function(){
        this.playerMovement();
        
        //infinite loop of background images
        this.updateBackground();       
        
        //debug stuff TODO:: erase
        game.debug.text("bgCounter: " + this.backgroundCounter, 32, 32);
        game.debug.text("Y:       " + this.player.y, 32, 64);
        game.debug.text("yOrig:   " + this.player.yOrig, 32, 120);
        game.debug.text("this.game.height: "+this.game.height, 32, 140);
        
        //The bounds of the world is adjusted to match the furthest the player has reached. i.e. the world moves with the player albeit only upwards
        this.world.setBounds(0, -this.player.yChange, this.world.width, this.game.height);
        
    },
    
//create-related functions
    createPlayer: function(){
        this.player = game.add.sprite(this.world.centerX, this.world.height -300, 'player');   this.player.anchor.set(0.5);
        this.player.maxSpeed = 300;
        
        //variables to track where the player started and track change in y distance
        this.player.yOrig = this.player.y;
        this.player.yChange = 0;
        
        //player physics
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
    },
    
    createBackground: function(){
        this.backgrounds = this.add.group();
        this.backgrounds.enableBody = true;
        this.backgrounds.createMultiple(3, 'background');
        for (var i=0; i<3; i++){
            this.createBackgroundOne(-600*i);
        }
    },
    
    //helper function
    createBackgroundOne: function(y){
        var background = this.backgrounds.getFirstDead();
        background.reset(0, y);
        this.backgroundCounter++;
        return background;
    },
    
//update-related functions    
    updateBackground: function(){
        this.backgrounds.forEachAlive( function(bg){
            if(bg.y > this.camera.y + this.game.height){
                bg.kill();
                this.createBackgroundOne(-600*this.backgroundCounter);
            }
        }, this);
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
    this.player.yChange = Math.max(this.player.yChange, -(this.player.y - this.player.yOrig));
    },
};


