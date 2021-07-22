class End extends Phaser.Scene {
    constructor() {
        super("endScene");
    }

    preload(){
        //background
        this.load.image('endScore', './assets/EndScreen-OrangeFilter.png');

    }

    create() {
        //text format
        let gameText = {
            fontFamily: 'Dancing Script',
            fontSize: '60px',
            color: '#FFFFFF',
            stroke: '#000000',
            //learned stroke and strokeThickness here:
            //https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Text.html
            strokeThickness: 2,
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //background
        this.add.image(0, 0, 'endScore').setOrigin(0, 0);
        this.add.text(game.config.width/2 + borderUISize*6.5, game.config.height - borderUISize*1, chestCount, gameText).setOrigin(0.5);
    }

    update(){
        
    }
}