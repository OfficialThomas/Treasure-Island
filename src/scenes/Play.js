class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load any art for the scene here
        //temp art
        this.load.image('temp_island', './assets/temp_island.png');

        //art
        //player
        this.load.spritesheet('idle', './assets/player_idle_animation.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('dig', './assets/Player_Digging_Animation.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('found', './assets/Player_Treasure_Animation.png', { frameWidth: 32, frameHeight: 32 });
        
        //objects
        this.load.image('chest', './assets/treasure_chest.png');

        //ui
        this.load.image('chestUI', './assets/chests_left_sprite.png');
        this.load.image('timeUI', './assets/time_left_sprite.png');
        
    }

    create() {
        //text format
        let gameText = {
            fontFamily: 'Impact',
            fontSize: '28px',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //background
        this.island = this.add.image(borderUISize*-4, 0, 'temp_island').setOrigin(0, 0);
        this.island.scale = 0.75;
        this.add.text(game.config.width/2, game.config.height/2, 'Play Scene', gameText).setOrigin(0.5);

        //background game objects (props)
        
        //player
        //idle player
        //reference https://labs.phaser.io/edit.html?src=src/animation/animation%20repeat%20event.js&v=3.55.2
        const idleAnimation = this.anims.create({ 
            key: 'blinking',
            frames: this.anims.generateFrameNumbers('idle'),
            frameRate: 12
        });
        this.playerC = this.add.sprite(game.config.width/2, game.config.height/2, 'idle').setOrigin(0.75, 0.75);
        this.playerC.play({key: 'blinking', repeat: -1});
        
        //chest
        this.lootA = this.add.image(Phaser.Math.Between(borderUISize*2, game.config.width - borderUISize*2), Phaser.Math.Between(borderUISize*2, game.config.height - borderUISize*2), 'chest').setOrigin(0.5);
        this.lootA.alpha = 0;

        //ui
        this.add.image(borderUISize*2, borderUISize, 'timeUI');
        this.add.image(game.config.width - borderUISize*3, borderUISize, 'chestUI');
        this.timeVal = this.add.text(borderUISize*3.5, borderUISize, timeScore, gameText).setOrigin(0.5);
        this.chestCount = 5;
        this.checkVal = this.add.text(game.config.width - borderUISize*1.5, borderUISize, this.chestCount, gameText).setOrigin(0.5);
        
    }

    update() {
        this.playerC.x = game.input.mousePointer.x;
        this.playerC.y = game.input.mousePointer.y;
        
        if(game.input.mousePointer.buttons == 1){
            if(this.checkCollision(this.playerC, this.lootA)){
                console.log('treasure found!');
                this.lootA.alpha = 1;

            }
        }
    }

    checkCollision(rocket, ship){
        //simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y){
            return true;
        } else {
            return false;
        }
    }
}