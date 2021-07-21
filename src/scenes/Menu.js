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
        this.load.image('title_card', './assets/title-name-display.png');

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
        //learned about set volume here
        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/audio/
        this.music = this.sound.add('bgm_final');
        this.music.setVolume(0.35);
        this.music.setLoop(true);
        this.music.play();

        //water sounds
        this.ambience = this.sound.add('bgm_temp');
        this.ambience.setVolume(0.1);
        this.ambience.setLoop(true);
        this.ambience.play();

        //menu art
        this.add.image(0, 0, 'menu_screen').setOrigin(0, 0);
        

        //title
        this.title = this.add.image(borderUISize, borderUISize, 'title_card').setOrigin(0, 0);
        this.title.setScale(0.5);
    }

    update(){
        if(game.input.mousePointer.buttons == 1){
            this.scene.start('playScene');
        }
    }
}