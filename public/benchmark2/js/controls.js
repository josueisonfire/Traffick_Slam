var controlsState =
{
  preload: function()
  {
      // lel ...
      game.load.image('menu_background', 'assets/menu_background.png');
      game.load.image('menu_button','assets/menu_button.png');
  },

  create: function()
  {
      // lel ...
      var menu_backButton;
      var menu_background_sprite;

      var insTie4;
      var text;
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

      insTie4 = this.addtext(400,250,'Press W to go up \nPress A to go left\nPress S to go backwards\nPress D to go to the right \nPress SpaceBar to jump \nPress E to grab/crouch \nHold Left Shift to run \nPress P to pause',40);
  },


  goBack: function()
  {
    game.state.start('menu');
  }
};
