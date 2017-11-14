
// declare global variables
/*MAIN MENU*/
var menuState = 
{
    //load all assets
    preload: function(){        
        game.load.image('menu_background', 'assets/menu_background.png');
        game.load.image('menu_button','assets/menu_button.png');
        game.load.image('menu_car','assets/menu_car.png');
    },
    
    create: function()
    {
        // declare nested local variables.
        var menu_background_sprite;
        var newgame_button;
        var controls_button;
        var help_button;
        var menu_car;
        var text_controls;
        var text_help;
        var text_newgame;
        var text_title1;
        var text_title2;
        this.displayMainMenu();
    },

    displayMainMenu: function()
    {
        //load image
        var font_size = 50;
        menu_background_sprite = game.add.sprite(0,0,'menu_background');
        newgame_button = game.add.sprite(380,50,'menu_button');
        controls_button = game.add.sprite(380,225,'menu_button');
        help_button = game.add.sprite(380,400,'menu_button');
        menu_car = game.add.sprite(45,200,'menu_car');
        menu_car.scale.setTo(0.5,0.5);
    
        text_newgame = this.addtext(565,125,'NEW GAME', font_size);
        text_controls = this.addtext(565,300,'CONTROLS', font_size);
        text_help = this.addtext(565,475,'HELP', font_size);
        text_title1 = this.addtext(190,150,'TRAFFIC', font_size);
        text_title2 = this.addtext(190,425,' JAM SLAM!', font_size);
    },

    addtext: function(x, y, str, size)
    {
        var text = game.add.text(x,y,str);
        text.anchor.set(0.5);
        text.font = 'Arial Black';
        text.fontSize = size;
        text.fontWeight = 'bold';
        text.fill = '#ffffff';
        text.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 0);
        return text;
    },

    start: function()
    {
        game.state.start('play');
    }
};



function killMenu()
{
    newgame_button.destroy();
    controls_button.destroy();
    help_button.destroy();
    menu_car.destroy();
    text_controls.destroy();
    text_help.destroy();
    text_newgame.destroy();
    text_title1.destroy();
    text_title2.destroy();
    menu_background_sprite.destroy();
}
