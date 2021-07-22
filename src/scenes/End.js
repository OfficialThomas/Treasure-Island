class End extends Phaser.Scene {
    constructor() {
        super("endScene");
    }

    preload(){
        //background
        this.load.image('endScore', './assets/EndScreen-OrangeFilter.png');

        //drum chan
        this.load.spritesheet('drum', './assets/enemy_newRed-Sheet.png', { frameWidth: 48, frameHeight: 32 });
    }

    create() {
        //text format
        let gameText = {
            fontFamily: 'Dancing Script',
            fontSize: '80px',
            color: '#FFFFFF',
            stroke: '#000000',
            //learned stroke and strokeThickness here:
            //https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Text.html
            strokeThickness: 2,
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //variables
        this.drumTimer = 500;
        this.playAgain = 5000;

        //background
        this.add.image(0, 0, 'endScore').setOrigin(0, 0);
        this.add.text(game.config.width/2 + borderUISize*4, game.config.height - borderUISize*1.25, chestCount, gameText).setOrigin(0.5);
        gameText.fontSize = 30;
        this.replay = this.add.text(game.config.width/2, borderUISize, Math.floor(this.playAgain/1000), gameText).setOrigin(0.5);
        //drum chan <3
        const drumAnimation = this.anims.create({ 
            key: 'drumWalk',
            frames: this.anims.generateFrameNumbers('drum'),
            frameRate: 8
        });
        this.drumChan = this.add.sprite(game.config.width/2 - borderUISize*5, game.config.height/2 + borderUISize*6.5, 'drum');
        this.drumChan.play({key: 'drumWalk', repeat: -1});
    }

    update(time, delta){
        if(this.playAgain > 0){
            this.playAgain -= delta;
            this.replay.text = Math.floor(this.playAgain/1000);
        } else {
            this.replay.text = 'Left Mouse Button to Dig Again'
            if(game.input.mousePointer.buttons == 1){
                timeScore = 180000;
                chestCount = 0;
                chestDiv = 1;
                digTimer = 0;
                this.scene.start('playScene');
            }
        }
        
        //learned how to flip a sprite here
        //https://phasergames.com/how-to-flip-a-sprite-in-phaser-3/
        this.drumTimer -= delta;
        if(this.drumTimer <= 0 && this.drumChan.flipX == false){
            this.drumChan.flipX = true;
            this.drumTimer = 500;
        } else if(this.drumTimer <= 0 && this.drumChan.flipX == true){
            this.drumChan.flipX = false;
            this.drumTimer = 500;
        }
    }
}