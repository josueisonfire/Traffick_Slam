var playState = {
    preload: function(){
        //load all assets
        this.load.image('background', 'assets/background1.png');
        this.load.spritesheet('player', 'assets/player.png', 38, 50);
        this.load.spritesheet('bus', 'assets/cars/bus (60x100)/bus.png', 30, 50);
        this.load.spritesheet('car1', 'assets/cars/cars (40x70)/BLACK CAR.png', 40, 70);
        this.load.spritesheet('car2', 'assets/cars/cars (40x70)/BLUE CAR.png', 40, 70);
        this.load.spritesheet('car3', 'assets/cars/cars (40x70)/COFFEE CAR.png', 40, 70);
        this.load.spritesheet('car4', 'assets/cars/cars (40x70)/GREEN CAR.png', 40, 70);
        this.load.spritesheet('car5', 'assets/cars/cars (40x70)/RED CAR.png', 40, 70);
        this.load.spritesheet('car6', 'assets/cars/cars (40x70)/TAXI.png', 40, 70);
        this.load.spritesheet('car7', 'assets/cars/cars (40x70)/UNICORN CAR.png', 40, 70);
        this.load.spritesheet('sports', 'assets/cars/sportz car (40x74)/Sports Car.png', 20, 37);
        this.load.spritesheet('truck', 'assets/cars/pickup (48x80)/pickup truck.png', 24, 40);
        this.load.spritesheet('policecar', 'assets/cars/POLICE CAR.png', 40,70);
        this.load.spritesheet('wall', 'assets/invwall.png', 40, 70);
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
    // soundtype:
    // -1 = stop all sounds.
    // 0 = hoverslide
    // 1 = click
    // 2 = music
    // 3 = carhorn
    // 4 = pickuphorn
    // 5 = bus_horn
    // 6 = smallcarhorn
    playSound: function(soundtype)
    {
      switch (soundstype)
      {
        case -1:
          //stop all sounds.
          slide.stop();
          click.stop();
          music.stop();
          carhorn.stop();
          pickuphorn.stop();
          bushorn.stop();
          smallcarhorn.stop();

        case 0:
          //play hoverslide sounds.
          slide.play();
          break;
        case 1:
          click.play();
          break;
        case 2:
          music.play();
          break;
        case 3:
          carhorn.play();
          break;
        case 4:
          pickuphorn.play()
          break;
        case 5:
          bushorn.play();
          break;
        case 6:
          smallcarhorn.play();
          break;
        default:
          //no sounds is played.

      }
    },

    create: function(){
        this.backgroundCounter = 0;

        this.physics.startSystem(Phaser.Physics.ARCADE);

        //create background images to repeat
        this.createBackground();

        //lane x values
        this.lanes = [60, 205, 333, 473, 604];

        //create cars
        this.initializeCars();
        //create player character
        this.createPlayer();

        //starting car
        this.startCar = this.cars.getFirstDead();
        this.startCar.reset(this.player.x, this.player.y);
        this.startCar.lane = 1;
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
            if (!this.player.invincible && !this.player.isDead){
                this.player.invincible = true;
                this.invmes = this.add.text(this.player.x, this.player.y, 'Godmode Activated');
                this.invmes2.destroy();
            }
            else{
                this.player.invincible = false;
                this.invmes.destroy();
                this.invmes2 = this.add.text(this.player.x, this.player.y, 'Godmode Deactivated');
            }
            }, this);
        //add all sounds:
        // -1 = stop all sounds.
        // 0 = hoverslide
        slide = game.add.audio('slide');
        // 1 = click
        click = game.add.audio('click');
        // 2 = music
        music = game.add.audio('music');
        // 3 = carhorn
        carhorn = game.add.audio("carnhorn");
        // 4 = pickuphorn
        pickuphorn = game.add.audio('pickuphorn');
        // 5 = bus_horn
        bushorn = game.add.audio('bushorn');
        // 6 = smallcarhorn
        smallcarhorn = game.add.audio('smallcarnhorn');

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
        game.debug.text("camera.x:          "+this.camera.x, 32, 160);
        game.debug.text("camera.y:          "+this.camera.y, 32, 180);
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
        this.cars.forEachAlive(this.carAI, this);

        //check for overlap with cars
        this.player.isOnCar = this.physics.arcade.overlap(this.player, this.cars, this.carOverlap, null, this);

        //player death
        if(!this.player.isOnCar && !this.player.jumped){
            this.playerDeath();
        }
    },

//create-related functions
    createPlayer: function(){
        this.player = this.add.sprite(this.lanes[1]/*TODO: change if needed*/, this.world.height -300, 'player');
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
        this.player.speedX = 220;
        this.player.accel = 20;
        this.player.frictionX = 0.9;
        this.player.frictionY = 1;
        this.player.jumpDuration = 1000;
        this.player.onCarspeed = 20;

        //variables to track where the player started and track change in y distance
        this.player.yOrig = this.player.y;
        this.player.yChange = 0;

        //player physics
        this.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;

        //change hitbox
        this.player.anchor.setTo(0.5, 1);
        this.player.body.height = 34;
        this.player.body.width = 20;
    },

    createPlayerAnimations: function(){
        this.player.animations.add('runningLeftDown', game.math.numberArray(0,3), 5, true);
        this.player.animations.add('jumpLeftDown', game.math.numberArray(4,9), 6*1000/this.player.jumpDuration, false);
        this.player.animations.add('runningRightDown', game.math.numberArray(10,13), 5, true);
        this.player.animations.add('jumpRightDown', game.math.numberArray(14,19), 6*1000/this.player.jumpDuration, false);
        this.player.animations.add('runningUp', game.math.numberArray(20,23), 5, true);
        this.player.animations.add('jumpUp', game.math.numberArray(24,29), 6*1000/this.player.jumpDuration, false);
        this.player.animations.add('runningDown', game.math.numberArray(30,33), 5, true);
        this.player.animations.add('jumpDown', game.math.numberArray(34,39), 6*1000/this.player.jumpDuration, false);
        this.player.animations.add('dying', game.math.numberArray(40,46), 5, false);
        this.player.animations.add('runningLeftUp', game.math.numberArray(47,50), 5, true);
        this.player.animations.add('jumpLeftUp', game.math.numberArray(51, 57), 6*1000/this.player.jumpDuration, false);
        this.player.animations.add('runningRightUp', game.math.numberArray(58,62), 5, true);
        this.player.animations.add('jumpRightUp', game.math.numberArray(63, 68), 6*1000/this.player.jumpDuration, false);
        this.player.animations.add('idleDown', game.math.numberArray(40,41), 5, true);
        this.player.animations.add('idleUp', game.math.numberArray(69,70), 5, true);
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
        for(var i= 1; i<8; i++){
            var tmpCar = this.cars.create(0,0, 'car'+i, null, false);
            tmpCar.type = 'normal';
        }
        /*this.cars.create(0,0, 'car1', null, false);
        this.cars.create(0,0, 'car2', null, false);
        this.cars.create(0,0, 'car3', null, false);
        this.cars.create(0,0, 'car4', null, false);
        this.cars.create(0,0, 'car5', null, false);
        this.cars.create(0,0, 'car6', null, false);
        this.cars.create(0,0, 'car7', null, false);*/
        var idCount = 0;
        this.cars.forEach(function(car)
        {
            car.anchor.setTo(0.5, 0.5)
            car.scale.setTo(2, 2);
            car.body.width *=1.8;
            car.body.height *=1.8;
            car.lane = 0;
            car.id = idCount;
            idCount++;
        });
        this.carTimer = true;
    },

    playerChangeLanes: function(){
        //function that handles the player changing lanes, using left and right keys UNUSED

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
        if(!this.player.onCar){
            if(this.cursors.up.isDown){
                this.player.body.velocity.y -= 1;
            }
            else if (this.cursors.down.isDown){
                this.player.body.velocity.y += this.player.accel;
            }
            else{
                //slowing down; friction-like effect
                this.player.body.velocity.y *= this.player.frictionY;
                //stop entirely when velocity is too small (while on ground)
                if (this.player.body.velocity.y < this.player.accel && this.player.body.velocity.y > -this.player.accel && !this.player.jumped)
                    this.player.body.velocity.y = 0;
            }

        // LEFT-RIGHT MOVEMENTS
            if(this.cursors.left.isDown){
                this.player.body.velocity.x = -this.player.speedX;
            }
            else if (this.cursors.right.isDown){
                this.player.body.velocity.x = this.player.speedX;
            }
            else{
                //slowing down; friction-like effect
                this.player.body.velocity.x *= this.player.frictionX;
                //stop entirely when velocity is too small (while on ground)
                if (this.player.body.velocity.x < this.player.accel && this.player.body.velocity.x > -this.player.accel && !this.player.jumped)
                    this.player.body.velocity.x = 0;
            }

        }
        //track the maximum distance player has traveled
    this.player.yChange = Math.max(this.player.yChange, -(this.player.y - this.player.yOrig));
    },


    playerJump: function(){

        if(this.player.jumped){
            //change spd values for air controls
            this.player.accel = 10;
            this.player.frictionY = 1;
            /*
        //change sprite size for going up
            if(this.player.goingUp){
                this.player.scale.x += this.player.jumpScale;
                this.player.scale.y += this.player.jumpScale;
            }
        //change sprite size for going down
            if (this.player.goingDown){
                this.player.scale.x -= this.player.jumpScale;
                this.player.scale.y -= this.player.jumpScale;
            }*/
        }else{
            //reset scale and speed values to original
            this.player.accel = 20;
            //this.player.friction = 0.9;
        }

        //when jump happens
        if (this.jumpKey.isDown && !this.player.jumped){
            this.player.jumped = true;
            this.time.events.add(this.player.jumpDuration, function(){
                    this.player.jumped = false;
                }, this);
        }
    },

    playerAnimate: function(){
        if(this.player.jumped){
            if(this.player.isFacingUp)
                    this.player.animations.play('jumpUp');
            else
                    this.player.animations.play('jumpDown');

        }else{
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
            this.time.events.add(1000, function(){
                this.world.removeAll();
                game.state.start('retry');
            }, this);
        }
    },
    createCars: function(){
        //generate a random # to determine the which lane to spawn car\
        if (this.carTimer){
            game.time.events.add(300, function(){this.carTimer = true;}, this)
            this.carTimer = false;
            this.createOneCar(Math.floor(Math.random() * 4)+1);
        }

    },
    createOneCar: function(lane){
        var car = this.cars.getFirstDead();
        if(car != null){
            if (lane != 0){
                car.reset(this.lanes[lane], this.camera.y + 680);
                car.lane = lane;
                car.body.velocity.y = this.player.body.velocity.y-(Math.floor(Math.random()*10+5))*10;
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
        car.seeCar = playState.physics.arcade.overlap(car.frontBox, this.cars);

        if(car.seeCar){
            car.body.velocity.y += 20;
        }

        game.debug.text("current car sees?:  "+car.seeCar, 32, 232);
        //check if box intersects with any other cars
        this.cars.forEachAlive(this.checkOverlap, this, car);
    },
    checkOverlap: function(car1, car2){
        if(car1.id != car2.id && car2.lane == car1.lane){
            if(car1.y < car2.y && car1.y > car2.y + car1.body.velocity.y/2 - 100){
                car2.body.velocity.y *= 0.8;
                playSound(3);
            }
        }
    },
    restart: function(){
    }
};
