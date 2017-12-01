var playState = {
    preload: function(){
        //load all assets
        this.load.spritesheet('player', 'assets/player.png', 17, 17)
    },
    
    create: function(){
        //create player character
        this.player = game.add.sprite(400, 300, 'player');
        
        this.player.scale.setTo(2,2);
        this.player.anchor.x = 0.5;
        this.player.anchor.y = 0.5
        //boolean variables
        this.player.jumped = false;
        this.player.goingUp = false;
        this.player.goingDown = false;
        
        this.player.jumpScale = 0.01;
        
        //player physics
        this.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        
        //controls
        this.jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);               
    },
    
    update: function(){
        this.playerJump();
        
        //debug stuff TODO:: erase
        game.debug.text("X:       " + this.player.x, 32, 32);
        game.debug.text("Y:       " + this.player.y, 32, 64);
        game.debug.text("player.jumped:    "+this.player.jumped, 32, 120);
        game.debug.text("player.goingUp:   "+this.player.goingUp, 32, 140);
        game.debug.text("player.goingDown: "+this.player.goingDown, 32, 160);
        game.debug.text("player velocityX: "+this.player.body.velocity.x, 32, 180);
        game.debug.text("player velocityY: "+this.player.body.velocity.y, 32, 200);
        
    },  
   
    
    playerJump: function(){   
        if(this.player.jumped){            
        //change sprite size for going up
            if(this.player.goingUp){
                this.player.scale.x += this.player.jumpScale;
                this.player.scale.y += this.player.jumpScale;
            }
        //change sprite size for going down
            if (this.player.goingDown){
                this.player.scale.x -= this.player.jumpScale;
                this.player.scale.y -= this.player.jumpScale;
            }            
        }else{
            //reset scale to original
            this.player.scale.setTo(2,2);
        }
        
        //when jump happens
        if (this.jumpKey.isDown && !this.player.jumped){
            this.player.jumped = true;            
            this.player.goingUp = true;
            //going up
            this.time.events.add(800, function(){
                this.player.goingUp = false;
                this.player.goingDown = true;
                //going down
                this.time.events.add(800, function(){
                    this.player.goingDown = false;
                    this.player.jumped = false;
                }, this);}, this);
        
        }
    }
};


