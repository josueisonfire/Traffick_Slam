/*UNUSED*/
var loadState = {
    preload: function(){
        //TODO:: add a loading... label

        //load all assets
        game.load.image('background', 'assets/background.png');
        game.load.spritesheet('player', 'assets/dude.png', 32, 48);

        //MENU state...
        game.load.image('menu_background', 'assets/menu_background.png');
        game.load.image('menu_button','assets/menu_button.png');
        game.load.image('menu_car','assets/menu_car.png');


        game.load.audio('slide', 'assets/slide.mp3');
        game.load.audio('click', 'assets/click.mp3')
        game.load.audio('music', 'assets/main_st.mp3')
    },

    create: function(){
        //call the menu state
        game.state.start('menu');
    }
}
