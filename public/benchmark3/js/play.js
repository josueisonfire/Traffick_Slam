var playState = {
    preload: function(){
        //load all assets
        this.load.image('background', 'assets/background1.png');
        this.load.spritesheet('player', 'assets/player.png', 17, 17);
        this.load.spritesheet('bus', 'assets/cars/bus (30x50)/bus.png', 30, 50);
        this.load.spritesheet('car1', 'assets/cars/cars (20x35)/BLACK CAR.png', 20, 35);
        this.load.spritesheet('car2', 'assets/cars/cars (20x35)/BLUE CAR.png', 20, 35);
        this.load.spritesheet('car3', 'assets/cars/cars (20x35)/COFFEE CAR.png', 20, 35);
        this.load.spritesheet('car4', 'assets/cars/cars (20x35)/GREEN CAR.png', 20, 35);
        this.load.spritesheet('car5', 'assets/cars/cars (20x35)/RED CAR.png', 20, 35);
        this.load.spritesheet('car6', 'assets/cars/cars (20x35)/TAXI.png', 20, 35);
        this.load.spritesheet('car7', 'assets/cars/cars (20x35)/UNICORN CAR.png', 20, 35);
        this.load.spritesheet('truck', 'assets/cars/pickup (24x40)/pickup truck.png', 24, 40);
        this.load.spritesheet('sports', 'assets/cars/sportz car (20x37)/Sports Car.png', 20, 37);
        this.load.image('wall', 'assets/invwall.png');
        //load all sounds
        game.load.audio('slide', 'assets/slide.mp3');
        game.load.audio('click', 'assets/click.mp3')
        game.load.audio('music', 'assets/main_st.mp3');
        //game.load.audio('street', 'assets/streetsounds.mp3');
        game.load.audio('smallcarhorn', 'assets/smallcarhorn.mp3');
        game.load.audio('carnhorn', 'assets/carhorn.mp3');
        game.load.audio('pickuphorn', 'assets/truckhorn.mp3');
        game.load.audio('bushorn', 'assets/bushorn.mp3');
    },
    // function o manage all the sounds.
    playSound: function(soundtype, loop, timeout)
    {

    },

    create: function(){
        this.backgroundCounter = 0;

        this.physics.startSystem(Phaser.Physics.ARCADE);

        //create background images to repeat
        this.createBackground();
        
        //lane x values
        this.lanes = [60, 190, 320, 450, 570];

        //create cars
        this.initializeCars();
        //create player character
        this.createPlayer();
        
        //starting car
        this.startCar = this.cars.getFirstDead();
        this.startCar.reset(this.player.x, this.player.y);
        this.startCar.body.velocity.y = -200;
        //create 2 inv walls
        //this.createWalls();

        //player animations
        this.createPlayerAnimations();

        //cursor controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.runKey = this.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.crouchKey = this.input.keyboard.addKey(Phaser.Keyboard.E);
        this.cheatKeyI = this.input.keyboard.addKey(Phaser.Keyboard.I);
        //cheats
        this.cheatKeyI.onDown.add(function(){
            if (this.player.invincible == false)
            this.player.invincible = true;
            else
            this.player.invincible = false;
            }, this);
        
    },

    update: function(){
        if (!this.player.isDead){
            this.playerAnimate();
            if(!this.player.disableControls){
                this.playerMovement();
                this.playerJump();
            }
        }
        //walls
        /*/walls follow player
        this.wall1.y = this.player.y;
        this.wall2.y = this.player.y;
        
        //player collide with walls
        this.physics.arcade.collide(this.player, this.wall1);
        this.physics.arcade.collide(this.player, this.wall2);*/

        
        //infinite loop of background images
        this.updateBackground();

        //debug stuff TODO:: erase
        game.debug.text("X:                 " + this.player.x, 32, 32);
        game.debug.text("Y:                 " + this.player.y, 32, 64);
        game.debug.text("player.jumped:     "+this.player.jumped, 32, 120);
        //game.debug.text("player.lane:       "+this.player.lane, 32, 140);
        game.debug.text("player oncar:      "+this.player.isOnCar, 32, 160);
        game.debug.text("player velocityX:  "+this.player.body.velocity.x, 32, 180);
        game.debug.text("player velocityY:  "+this.player.body.velocity.y, 32, 200);
        //game.debug.text("lane position:     "+this.lanes[this.player.lane], 32, 220);
        //The bounds of the world is adjusted to match the furthest the player has reached. i.e. the world moves with the player albeit only upwards
        this.world.setBounds(0, -this.player.yChange, this.world.width, this.game.height);

        //player sprint
        if(!this.player.jumped){
            if (this.runKey.isDown){

                this.player.onCarspeed = 80;
            }
            else{
                this.player.onCarspeed = 20;
            }
        }

        //periodically create cars
        this.createCars();
        //if a car goes off screen + 200 then kill that car
        this.cars.forEach(this.destroyCar);
        
        //car AI
        this.cars.forEach(this.carAI);

        //check for overlap with cars
        this.player.isOnCar = this.physics.arcade.overlap(this.player, this.cars, this.carOverlap, null, this);
        
        //player death
        if(!this.player.isOnCar && !this.player.jumped){
            this.playerDeath();
        }
    },

//create-related functions
    createPlayer: function(){
        this.player = game.add.sprite(this.lanes[1]/*TODO: change if needed*/, this.world.height -300, 'player');
        this.player.scale.setTo(2,2);
        //this.player.anchor.setTo(0.5,0.5);
        //boolean variables
        this.player.isDead = false;
        this.player.jumped = false;
        this.player.goingUp = false;
        this.player.goingDown = false;
        this.player.isFacingUp = true;
        this.player.isOnCar = false;
        this.player.disableControls = false;
        this.player.invincible = false;
        //speed properties
        this.player.maxSpeed = 300;
        this.player.accel = 20;
        this.player.friction = 1;
        this.player.jumpScale = 0.02;
        this.player.onCarspeed = 20;

        //variables to track where the player started and track change in y distance
        this.player.yOrig = this.player.y;
        this.player.yChange = 0;

        //player physics
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
    },

    createPlayerAnimations: function(){
        this.player.animations.add('runningLeftDown', game.math.numberArray(0,3), 5, true);
        this.player.animations.add('runningRightDown', game.math.numberArray(4,7), 5, true);
        this.player.animations.add('runningUp', game.math.numberArray(8,11), 5, true);
        this.player.animations.add('runningDown', game.math.numberArray(12,15), 5, true);
        this.player.animations.add('dying', game.math.numberArray(16,22), 5, false);
        this.player.animations.add('runningLeftUp', game.math.numberArray(23,26), 5, true);
        this.player.animations.add('runningRightUp', game.math.numberArray(27,30), 5, true);
        this.player.animations.add('idleDown', game.math.numberArray(16,17), 5, true);
        this.player.animations.add('idleUp', game.math.numberArray(31,32), 5, true);
        this.player.animations.add('jumpLeftUp', [23], 1, true);
        this.player.animations.add('jumpUp', [9], 1, true);
        this.player.animations.add('jumpRightUp', [27], 1, true);
        this.player.animations.add('jumpLeftDown', [0], 1, true);
        this.player.animations.add('jumpDown', [13], 1, true);
        this.player.animations.add('jumpRightDown', [4], 1, true);
        this.player.animations.add('crouch', [19], 1, true);
    },

    createBackground: function(){
        this.backgrounds = this.add.group();
        this.backgrounds.createMultiple(3, 'background');
        for (var i=0; i<3; i++){
            this.createBackgroundOne(-625*i);
        }
    },

    //helper function
    createBackgroundOne: function(y){
        var background = this.backgrounds.getFirstDead();
        background.reset(0, y);
        this.backgroundCounter++;
        return background;
    },
    
    createWalls: function(){/*
        this.wall1 = this.add.sprite(this.lanes[this.player.lane-1]+20, this.player.y, 'wall');
        this.wall2 = this.add.sprite(this.lanes[this.player.lane+1], this.player.y, 'wall');
        this.wall1.anchor.setTo(0, 0.5);
        this.wall2.anchor.setTo(0, 0.5);
        this.physics.arcade.enable(this.wall1);
        this.physics.arcade.enable(this.wall2);
        this.wall1.body.immovable = true;
        this.wall2.body.immovable = true;
        //TODO: maek invisible*/
    },
    
    initializeCars: function(){
        this.cars = this.add.group();
        this.cars.enableBody = true;
        this.cars.create(0,0, 'car1', null, false);
        this.cars.create(0,0, 'car2', null, false);
        this.cars.create(0,0, 'car3', null, false);
        this.cars.create(0,0, 'car4', null, false);
        this.cars.create(0,0, 'car5', null, false);
        this.cars.create(0,0, 'car6', null, false);
        this.cars.create(0,0, 'car7', null, false);
        this.cars.forEach(function(car)
        {
            car.scale.setTo(2.8, 2.8);
        })
        this.carTimer = true;
    },
    
    playerChangeLanes: function(){
        //function that handles the player changing lanes, using left and right keys
        
        this.cursors.left.onDown.add(function(){
            if(!this.player.disableControls){
                if(this.player.lane > 1){
                    this.player.lane -= 1;
                    this.player.x -= 130;
                }                
            }
        }, this);
        this.cursors.right.onDown.add(function(){
            if(!this.player.disableControls){
                if(this.player.lane < 4){
                    this.player.lane += 1;
                    this.player.x += 130;
                }                
            }
        }, this);
    },
    
//update-related functions
    updateBackground: function(){
        this.backgrounds.forEachAlive( function(bg){
            if(bg.y > this.camera.y + this.game.height){
                bg.kill();
                this.createBackgroundOne(-625*this.backgroundCounter);
            }
        }, this);
    },

    playerMovement: function(){
        //up and down movements
        /*OLD CROUCH STUFF
        if(this.crouchKey.isDown && !this.player.jumped)
            this.player.disableControls = true;
        else
            this.player.disableControls = false;
            */
        if(this.player.onCar){
        }
        else{
            if(this.cursors.up.isDown && this.player.body.velocity.y > -this.player.maxSpeed){
                this.player.body.velocity.y -= this.player.accel;
            }
            else if (this.cursors.down.isDown && this.player.body.velocity.y < this.player.maxSpeed){
                this.player.body.velocity.y += this.player.accel;
            }
            else{
                //slowing down; friction-like effect
                this.player.body.velocity.y *= this.player.friction;
                //stop entirely when velocity is too small (while on ground)
                if (this.player.body.velocity.y < this.player.accel && this.player.body.velocity.y > -this.player.accel && !this.player.jumped)
                    this.player.body.velocity.y = 0;
            }
        
        // LEFT-RIGHT MOVEMENTS
            if(this.cursors.left.isDown && this.player.body.velocity.x > -this.player.maxSpeed){
                this.player.body.velocity.x -= this.player.accel;
            }
            else if (this.cursors.right.isDown && this.player.body.velocity.x < this.player.maxSpeed){
                this.player.body.velocity.x += this.player.accel;
            }
            else{
                //slowing down; friction-like effect
                this.player.body.velocity.x *= this.player.friction;
                //stop entirely when velocity is too small (while on ground)
                if (this.player.body.velocity.x < this.player.accel && this.player.body.velocity.x > -this.player.accel && !this.player.jumped)
                    this.player.body.velocity.x = 0;
            }
        
        }
        //track the maximum distance player has traveled
    this.player.yChange = Math.max(this.player.yChange, -(this.player.y - this.player.yOrig));
    },
    

    playerJump: function(){
    //TODO:: drifting bug after jumping; has to do with changing scale probably
        
        //TODO:: make player sprite go under car when on ground but appear on top of car when jumping/ oncar

        if(this.player.jumped){
            //change spd values for air controls
            this.player.accel = 15;
            this.player.friction = 1;
            this.player.maxSpeed = 10000;
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
            //reset scale and speed values to original
            this.player.accel = 20;
            //this.player.friction = 0.9;
        }

        //when jump happens
        if (this.jumpKey.isDown && !this.player.jumped){
            this.player.jumped = true;
            this.player.goingUp = true;
            //going up
            this.time.events.add(550, function(){
                this.player.goingUp = false;
                this.player.goingDown = true;
                //going down
                this.time.events.add(550, function(){
                    this.player.goingDown = false;
                    this.player.jumped = false;
                }, this);}, this);
        }
    },

    playerAnimate: function(){
        if(this.player.jumped){
            if(this.player.isFacingUp){
                if(this.cursors.left.isDown){
                    this.player.animations.play('jumpLeftUp');
                }else if(this.cursors.right.isDown){
                    this.player.animations.play('jumpRightUp');
                }else{
                    this.player.animations.play('jumpUp');
                }
            }else{
                if(this.cursors.left.isDown){
                    this.player.animations.play('jumpLeftDown');
                }else if(this.cursors.right.isDown){
                    this.player.animations.play('jumpRightDown');
                }else{
                    this.player.animations.play('jumpDown');
                }
            }
        }
        else{
            if(this.cursors.up.isDown){
                if(this.cursors.left.isDown){
                    this.player.animations.play('runningLeftUp');
                }else if(this.cursors.right.isDown){
                    this.player.animations.play('runningRightUp');
                }else{
                    this.player.animations.play('runningUp');
                }
                this.player.isFacingUp = true;
            }else if(this.cursors.down.isDown){
                if(this.cursors.left.isDown){
                    this.player.animations.play('runningLeftDown');
                }else if(this.cursors.right.isDown){
                    this.player.animations.play('runningRightDown');
                }else{
                    this.player.animations.play('runningDown');
                }
                this.player.isFacingUp = false;
            }else{
                if(this.player.isFacingUp){
                    if(this.cursors.left.isDown){
                        this.player.animations.play('runningLeftUp');
                    }else if(this.cursors.right.isDown){
                        this.player.animations.play('runningRightUp');
                    }else{
                        this.player.animations.play('idleUp');
                    }
                }else{
                    if(this.cursors.left.isDown){
                        this.player.animations.play('runningLeftDown');
                    }else if(this.cursors.right.isDown){
                        this.player.animations.play('runningRightDown');
                    }else{
                        this.player.animations.play('idleDown');
                    }
                }
            }
        }
    },
    playerDeath: function(){
        if (!this.player.invincible && !this.player.isDead){
        this.player.isDead = true;
        this.player.body.velocity.setTo(0,0);
        this.player.animations.play('dying');
        }
    },
    createCars: function(){
        //TODO:: if number of cars on screen < a number then create a random car KEEP TERM
        //generate a random # to determine the which lane to spawn car\
        if (this.carTimer){
            game.time.events.add(500, function(){this.carTimer = true;}, this)
            this.carTimer = false;
            this.createOneCar(Math.floor(Math.random() * 4)+1);
        }

    },
    createOneCar: function(lane){
        var car = this.cars.getFirstDead();
        if(car != null){
            if (lane != 0){
                car.reset(this.lanes[lane], this.camera.y + 640);
                car.body.velocity.y = this.player.body.velocity.y-(Math.random())*100;
            }
            else{
                car.reset(this.lanes[lane], this.camera.y - 140);
                car.body.velocity.y = 500;
            }
        }

    },
    destroyCar: function(car){
        if(car.y > game.camera.y + 800 || car.y < game.camera.y - 200){
            car.kill();
        }
    },

    carOverlap: function(player, car){
        if(!player.jumped){
        //if player is inside the zone 
            /*if(player.x+player.width/2 > car.x && player.x+player.width/2 < car.x + car.width && player.y+player.height/2 > car.y && player.y+player.height/2 < car.y + car.height)
                player.isOnCar = true;
            else{
                player.isOnCar = false;
            }*/

            
                if(this.cursors.up.isDown)
                    player.body.velocity.y = car.body.velocity.y-this.player.onCarspeed;
                else if(this.cursors.down.isDown)
                    player.body.velocity.y = car.body.velocity.y+this.player.onCarspeed;
                else
                    player.body.velocity.y = car.body.velocity.y;
                
                if(this.cursors.left.isDown)
                    player.body.velocity.x = car.body.velocity.x-this.player.onCarspeed;
                else if(this.cursors.right.isDown)
                    player.body.velocity.x = car.body.velocity.x+this.player.onCarspeed;
                else
                    player.body.velocity.x = car.body.velocity.x;
                
        }
    },
    
    carAI: function(car){
        //TODO: implement
        //attach invisible box in front of car, check if that collides with any cars or obstacles
    }
};
