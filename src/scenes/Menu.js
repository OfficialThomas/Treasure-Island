class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        //load audio
        this.load.audio('sfx_detected', './assets/Detected.wav');
        //temp background music from https://mixkit.co/free-sound-effects/beach/ using a free licence
        this.load.audio('bgm_temp', './assets/bgm_temp.wav');
        //background music
        this.load.audio('bgm_final', './assets/Treasure_Island_bgm.wav');

        //load art
        //temp
        this.load.image('menu_temp', './assets/menu-screen.png');

        //title
        this.load.image('title_card', './assets/tile-name-display.png');

        //background
        this.load.image('menu_screen', './assets/MainMenu-bird.png');

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
        //music
        this.music = this.sound.add('bgm_final');
        this.music.setLoop(true);
        this.music.play();

        //menu art
        this.add.image(0, 0, 'menu_screen').setOrigin(0, 0);

        //title
        this.add.image(borderUISize, borderUISize, 'title_card').setOrigin(0, 0);
    }

    update(){
        if(game.input.mousePointer.buttons == 1){
            this.scene.start('playScene');
        }
    }
}