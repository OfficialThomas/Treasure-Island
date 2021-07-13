class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        //load audio
        this.load.audio('sfx_detected', './assets/Detected.wav');
        //temp background music from https://mixkit.co/free-sound-effects/beach/ using a free licence
        this.load.audio('bgm_temp', './assets/bgm_temp.wav');

    }

    create() {
        //text format
        let gameText = {
            fontFamily: 'Impact',
            fontSize: '28px',
            color: '#000000',
            backgroundColor: '#F3B141',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.text(game.config.width/2, game.config.height/2, 'Menu Scene', gameText).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize*2, 'Left Click on the mouse to start', gameText).setOrigin(0.5);
    }

    update(){
        if(game.input.mousePointer.buttons == 1){
            this.scene.start('playScene');
        }
    }
}