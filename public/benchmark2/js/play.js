var playState = {
    preload: function(){
        //load all assets
        this.load.image('background', 'assets/background.png');
        this.load.spritesheet('player', 'assets/dude.png', 32, 48);
        this.load.image('car1', 'assets/car1.png');
    },
    
    create: function(){
        this.backgroundCounter = 0;
        
        //create background images to repeat
        this.createBackground();
        
        //create cars        
        var car1 = this.add.sprite(408,400, 'car1');
        car1.scale.setTo(0.25,0.25);
        game.physics.arcade.enable(car1);
        car1.body.velocity.y = -450;
        
        //create player character
        this.createPlayer();
                
        //cursor controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.runKey = this.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.crouchKey = this.input.keyboard.addKey(Phaser.Keyboard.E);        
                
    },
    
    update: function(){
        this.playerMovement();
        this.playerJump();
        //infinite loop of background images
        this.updateBackground();       
        
        //debug stuff TODO:: erase
        game.debug.text("bgCounter: " + this.backgroundCounter, 32, 32);
        game.debug.text("Y:       " + this.player.y, 32, 64);
        game.debug.text("player.jumped:    "+this.player.jumped, 32, 120);
        game.debug.text("player.goingUp:   "+this.player.goingUp, 32, 140);
        game.debug.text("player.goingDown: "+this.player.goingDown, 32, 160);
        game.debug.text("player velocityX: "+this.player.body.velocity.x, 32, 180);
        game.debug.text("player velocityY: "+this.player.body.velocity.y, 32, 200);
        
        //The bounds of the world is adjusted to match the furthest the player has reached. i.e. the world moves with the player albeit only upwards
        this.world.setBounds(0, -this.player.yChange, this.world.width, this.game.height);
        
        //player sprint
        if (this.runKey.isDown){
            this.player.maxSpeed = 750;
        }
        else{
            this.player.maxSpeed = 300;
        }
    },
    
//create-related functions
    createPlayer: function(){
        this.player = game.add.sprite(this.world.centerX, this.world.height -300, 'player');   this.player.anchor.set(0.5);
        this.player.maxSpeed = 300;
        this.player.isDead = false;
        this.player.jumped = false;
        this.player.goingUp = false;
        this.player.goingDown = false;
        
        //variables to track where the player started and track change in y distance
        this.player.yOrig = this.player.y;
        this.player.yChange = 0;
        
        //player physics
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
    },
    
    createBackground: function(){
        this.backgrounds = this.add.group();
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
    
    createCars: function(){
        this.cars = this.add.group();
        //TODO:: implement
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
        //if(2keyspressed for any 4 directions) player velocity / sqrt(2)
    //track the maximum distance player has traveled
    this.player.yChange = Math.max(this.player.yChange, -(this.player.y - this.player.yOrig));
    },
    
    playerJump: function(){
    //TODO:: drifiting bug after jumping; has to do with changing scale probably    
        if(this.player.jumped){
        //change sprite size for going up
            if(this.player.goingUp){
                this.player.scale.x *= 1.01;
                this.player.scale.y *= 1.01;
            }
        //change sprite size for going down
            if (this.player.goingDown){
                this.player.scale.x /= 1.01;
                this.player.scale.y /= 1.01;
            }
        }else{
            this.player.scale.setTo(1,1);
        }
        
        if (this.jumpKey.isDown && !this.player.jumped){
            this.player.jumped = true;
            this.player.goingUp = true;
            //going up
            this.time.events.add(1000, function(){
                this.player.goingUp = false;
                this.player.goingDown = true;
                //going down
                this.time.events.add(1000, function(){
                    this.player.goingDown = false;
                    this.player.jumped = false;
                    //reset scale to original
                    this.player.scale.x = 1;
                    this.player.scale.y = 1;
                }, this);}, this);
        }
    },
    
    playerDead: function(){
        
    },
};


