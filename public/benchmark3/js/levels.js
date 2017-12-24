var levelsState = {
    preload: function(){
        this.load.image('screen', 'assets/levelchoose.png');
        this.load.image('button1', 'assets/level1.png');
        this.load.image('button2', 'assets/level2.png');
        this.load.image('button3', 'assets/level3.png');
        this.load.image('button4', 'assets/level4.png');

    },
    create: function(){
        this.add.sprite(game.camera.x, game.camera.y, 'screen');
        this.button1 = this.add.sprite(game.camera.x+50, game.camera.y+300, 'button1');
        this.button2 = this.add.sprite(game.camera.x+233, game.camera.y+300, 'button2');
        this.button3 = this.add.sprite(game.camera.x+416, game.camera.y+300, 'button3');
        this.button4 = this.add.sprite(game.camera.x+600, game.camera.y+300, 'button4');
        
        this.button1.scale.setTo(0.5,0.5);
        this.button2.scale.setTo(0.5,0.5);
        this.button3.scale.setTo(0.5,0.5);
        this.button4.scale.setTo(0.5,0.5);
        
        this.button2.alpha = 0.3;
        this.button3.alpha = 0.3;
        this.button4.alpha = 0.3;
        
        this.button1.inputEnabled = true;
        if(unlocked>=2){
            this.button2.inputEnabled = true;
            this.button2.alpha = 1;
        }if(unlocked>=3){
            this.button3.inputEnabled = true;
            this.button3.alpha = 1;
        }if(unlocked>=4){
            this.button4.inputEnabled = true;
            this.button4.alpha = 1;
        }
        
        this.button1.events.onInputDown.add(function(){
            levelNum = 1;
            game.state.start('play');
        }, this);
        this.button2.events.onInputDown.add(function(){
            levelNum = 2;
            game.state.start('play');
        }, this);
    
        this.button3.events.onInputDown.add(function(){
            levelNum = 3;
            game.state.start('play');
        }, this);
    
        this.button4.events.onInputDown.add(function(){
            levelNum = 4;
            game.state.start('play');
        }, this);
    
    }
};
