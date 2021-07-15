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

        //music
        this.music = this.sound.add('bgm_temp');
        this.music.setLoop(true);
        this.music.play();

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
        this.timeVal = this.add.text(borderUISize*5, borderUISize, timeScore, gameText).setOrigin(0.5);
        this.chestCount = 5;
        this.checkVal = this.add.text(game.config.width - borderUISize*1.5, borderUISize, this.chestCount, gameText).setOrigin(0.5);
        this.add.image(borderUISize*2, borderUISize, 'timeUI');
        this.add.image(game.config.width - borderUISize*3, borderUISize, 'chestUI');
        
        //variables
        this.gameEnd = false;
        this.timeEnd = 2000;
        this.digTimer = 0;
        this.soundTimer = 0;
        this.detectMod = 2.5;
    }

    update(time, delta) {
        if(!this.gameEnd){
            timeScore += delta;
            this.timeVal.text = Math.floor(timeScore/1000);

            if(this.digTimer > 0){
                this.digTimer -= delta;
            } else{
                this.playerC.x = game.input.mousePointer.x;
                this.playerC.y = game.input.mousePointer.y;

                //metal detector
                if(this.soundTimer > 0){
                    this.soundTimer -= delta;
                }
                this.metalDetector();
                
                //mouse click
                if(game.input.mousePointer.buttons == 1){
                    if(this.checkCollision(this.playerC, this.lootA)){
                        this.lootA.alpha = 1;

                        this.chestCount -= 1;
                        this.checkVal.text = this.chestCount;
                        if(this.chestCount <= 0){
                            this.gameEnd = true;
                        }

                        this.lootA = this.add.image(Phaser.Math.Between(borderUISize*2, game.config.width - borderUISize*2), Phaser.Math.Between(borderUISize*2, game.config.height - borderUISize*2), 'chest').setOrigin(0.5);
                        this.lootA.alpha = 0;
                    }
                    this.digTimer = 2000;
                }
            }

        } else {
            this.timeEnd -= delta;
            if(this.timeEnd <= 0){
                this.music.stop();
                this.scene.start('endScene');
            }

        }
        
    }

    //using method from rocket patrol
    checkCollision(rocket, ship){
        //simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y){
            return true;
        } else {
            return false;
        }
    }

    //adjusted method from rocket patrol
    checkCollisionWide(rocket, ship){
        //simple AABB checking
        if (rocket.x < ship.x + ship.width*this.detectMod && rocket.x + rocket.width*this.detectMod > ship.x && rocket.y < ship.y + ship.height*this.detectMod && rocket.height*this.detectMod + rocket.y > ship.y){
            return true;
        } else {
            return false;
        }
    }

    metalDetector(){
        if(this.checkCollision(this.playerC, this.lootA) && this.soundTimer <= 0){
            //detection is close
            this.sound.play('sfx_detected');
            this.soundTimer = 500;
        } else if(this.checkCollisionWide(this.playerC, this.lootA) && this.soundTimer <= 0){
            //detection is far
            this.sound.play('sfx_detected');
            this.soundTimer = 1000;
        }
        return;
    }
}