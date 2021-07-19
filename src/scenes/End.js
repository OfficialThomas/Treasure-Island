class End extends Phaser.Scene {
    constructor() {
        super("endScene");
    }

    preload(){

    }

    create() {
        //text format
        let gameText = {
            fontFamily: 'Dancing Script',
            fontSize: '28px',
            color: '#000000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.text(game.config.width/2, game.config.height/2, 'End Scene', gameText).setOrigin(0.5);
        this.add.text(game.config.width/2 - borderUISize*0.9, game.config.height/2 + borderUISize*2, 'Time:', gameText).setOrigin(0.5);
        this.add.text(game.config.width/2 + borderUISize*2, game.config.height/2 + borderUISize*2, Math.floor(timeScore/1000), gameText).setOrigin(0.5);
    }

    update(){
        //this.scene.start('playScene');
    }
}