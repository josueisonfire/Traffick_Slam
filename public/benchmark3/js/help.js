var helpState =
{
    preload: function()
    {
        // lel ...
        game.load.image('menu_background', 'assets/menu_background.png');
        game.load.image('menu_button','assets/menu_button.png');
        game.load.audio('slide', 'assets/slide.mp3');
        game.load.audio('click', 'assets/click.mp3')
        game.load.audio('music', 'assets/main_st.mp3');
    },

    create: function()
    {
        // lel ...
        var menu_backButton;
        var menu_background_sprite;
        var text;
        var insTie4;
        music = game.add.audio('music');
        slide = game.add.audio('slide');
        click = game.add.audio('click');
        this.displayMainMenu();
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

    displayMainMenu: function()
    {
        //load image
        var font_size = 50;
        menu_background_sprite = game.add.sprite(0,0,'menu_background');
        //menu_background_sprite.addtext();
        menu_backButton = game.add.sprite(400,520,'menu_button');
        menu_backButton.scale.setTo(0.4);
        menu_backButton.anchor.set(0.5);
        menu_backButton.inputEnabled = true;
        menu_backButton.events.onInputDown.add(this.goBack, this);
        text = this.addtext(400,525,'BACK', 30);
        insTie4 = this.addtext(400,250,'Help Jamie save her kidnapped wife amidst this traffic! \nJump on cars and use them to travel forward! \n \n But beware  of falling down and getting run over, \ngetting caught and shot by the police, or stepping on a pointy \ntaxi sign, as they may kill you! \n \n Good Luck!',20);
    },

    goBack: function()
    {
      music.stop()
      click.play()
      game.state.start('menu');
    }
};
