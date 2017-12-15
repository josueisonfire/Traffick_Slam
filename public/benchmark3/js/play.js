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
        //load all sounds
        game.load.audio('slide', 'assets/slide.mp3');
        game.load.audio('click', 'assets/click.mp3')
        game.load.audio('music', 'assets/main_st.mp3');
        game.load.audio('street', 'assets/streetsounds.mp3');
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

        //create cars
        this.initializeCars();
        //create player character
        this.createPlayer();

        //player animations
        this.createPlayerAnimations();

        //cursor controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.runKey = this.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.crouchKey = this.input.keyboard.addKey(Phaser.Keyboard.E);

        //lane x values
        this.lanes = [60, 190, 320, 450, 570];

    },

    update: function(){
        if (!this.player.isDead){
            this.playerMovement();
            this.playerAnimate();
            this.playerJump();
        }
        //infinite loop of background images
        this.updateBackground();

        //debug stuff TODO:: erase
        game.debug.text("X:                 " + this.player.x, 32, 32);
        game.debug.text("Y:                 " + this.player.y, 32, 64);
        game.debug.text("player.jumped:     "+this.player.jumped, 32, 120);
        game.debug.text("player.goingUp:    "+this.player.goingUp, 32, 140);
        game.debug.text("player.goingDown:  "+this.player.goingDown, 32, 160);
        game.debug.text("player velocityX:  "+this.player.body.velocity.x, 32, 180);
        game.debug.text("player velocityY:  "+this.player.body.velocity.y, 32, 200);
        game.debug.text("cartimer:          "+this.carTimer, 32, 220);

        //The bounds of the world is adjusted to match the furthest the player has reached. i.e. the world moves with the player albeit only upwards
        this.world.setBounds(0, -this.player.yChange, this.world.width, this.game.height);

        //player sprint
        if(!this.player.jumped){
            if (this.runKey.isDown){
                this.player.maxSpeed = 750;
            }
            else{
                this.player.maxSpeed = 300;
            }
        }

        //periodically create cars
        this.createCars();
        //if a car goes off screen + 600 then kill that car
        this.cars.forEach(this.destroyCar);

        //if player is not in the air, check for overlap with cars
        if(!this.player.jumped)
            this.physics.arcade.overlap(this.player, this.cars, this.carOverlap, null, this);
    },

//create-related functions
    createPlayer: function(){
        this.player = game.add.sprite(this.world.centerX, this.world.height -300, 'player');
        //this.player.anchor.setTo(0.5,0.5);
        this.player.scale.setTo(2,2);
        //boolean variables
        this.player.isDead = false;
        this.player.jumped = false;
        this.player.goingUp = false;
        this.player.goingDown = false;
        this.player.isFacingUp = true;
        this.player.isOnCar = false;
        //speed properties
        this.player.maxSpeed = 300;
        this.player.accel = 20;
        this.player.friction = 0.9;
        this.player.jumpScale = 0.01;

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

    initializeCars: function(){
        this.cars = this.add.group();
        this.cars.enableBody = true;
        this.cars.createMultiple(20, 'car1');
        this.cars.forEach(function(car){
            car.scale.setTo(2.5, 2.5);
        })
        this.carTimer = true;
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
        if(this.crouchKey.isDown && !this.player.jumped){
            this.player.body.velocity.setTo(0,0);
        }else{
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
            if(this.cursors.left.isDown && this.player.body.velocity.x > -this.player.maxSpeed){
                this.player.body.velocity.x -= this.player.accel;
            }
            else if(this.cursors.right.isDown && this.player.body.velocity.x < this.player.maxSpeed){
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
            //TODO:: slow down diagonal movements --by a factor of 1/sqrt(2)? probably not--
            //if(2keyspressed for any 4 directions) player velocity / sqrt(2)
        //track the maximum distance player has traveled
    this.player.yChange = Math.max(this.player.yChange, -(this.player.y - this.player.yOrig));
    },

    playerJump: function(){
    //TODO:: drifting bug after jumping; has to do with changing scale probably
        if(this.player.jumped){
            //change spd values for air controls
            this.player.accel = 8;
            this.player.friction = 0.9999;
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
            this.player.friction = 0.9;
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
        else if (this.crouchKey.isDown){
            this.player.animations.play('crouch');
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

    createCars: function(){
        //TODO:: if number of cars on screen < a number then create a random car KEEP TERM
        //generate a random # to determine the which lane to spawn car\
        if (this.carTimer){
            game.time.events.add(1000, function(){this.carTimer = true;}, this)
            this.carTimer = false;
            //TODO:: rng fix
            this.createOneCar(Math.floor(Math.random() * 4.99));
        }

    },
    createOneCar: function(lane){
        var car = this.cars.getFirstDead();
        if (lane != 0){
            car.reset(this.lanes[lane], this.camera.y + 640);
            car.body.velocity.y = -600/lane;
        }
        else{
            car.reset(this.lanes[lane], this.camera.y - 140);
            car.body.velocity.y = 500;
        }

    },
    destroyCar: function(car){
        if(car.y > game.camera.y + 1200 || car.y < game.camera.y - 600){
            car.kill();
        }
    },

    carOverlap: function(player, car){
        //if player is inside the zone (110% of the car sprite + more room down)
        if(player.x > car.x - car.width * 0.1 && player.x + player.width < car.x + car.width *1.1 && player.y > car.y - car.height * 0.1 && player.y + player.height < car.y + car.height *1.5)
            player.isOnCar = true;
        else{
            player.isOnCar = false;
            player.animations.play('dying');
        }

        if(player.isOnCar && this.crouchKey.isDown){
            player.body.velocity.x = car.body.velocity.x;
            player.body.velocity.y = car.body.velocity.y;
        }

    }
};
