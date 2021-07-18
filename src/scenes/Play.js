class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load any art for the scene here
        //temp art
        this.load.image('temp_island', './assets/temp_island.png');

        //art
        //background
        this.load.image('island0', './assets/level0edit.png');

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

        //music
        this.music = this.sound.add('bgm_temp');
        this.music.setLoop(true);
        this.music.play();

        //background
        this.island = this.add.image(0, 0, 'island0').setOrigin(0, 0);

        //background game objects (props)
        
        //player
        //idle player
        //reference https://labs.phaser.io/edit.html?src=src/animation/animation%20repeat%20event.js&v=3.55.2
        const idleAnimation = this.anims.create({ 
            key: 'blinking',
            frames: this.anims.generateFrameNumbers('idle'),
            frameRate: 12
        });
        this.playerC = this.add.sprite(game.config.width/2, game.config.height/2 + borderUISize*2, 'idle').setOrigin(0.75, 0.75);
        this.playerC.play({key: 'blinking', repeat: -1});
        
        //chest
        this.lootA = this.add.image(Phaser.Math.Between(borderUISize*2, game.config.width - borderUISize*2), Phaser.Math.Between(borderUISize*2, game.config.height - borderUISize*2), 'chest').setOrigin(0.5);
        this.lootA.alpha = 0;

        //ui
        //time
        this.timeVal = this.add.text(borderUISize*5, borderUISize, Math.floor(timeScore/1000), gameText).setOrigin(0.5);
        //chests
        this.checkVal = this.add.text(game.config.width - borderUISize*1.5, borderUISize, chestCount, gameText).setOrigin(0.5);
        //text
        this.add.image(borderUISize*2, borderUISize, 'timeUI');
        this.add.image(game.config.width - borderUISize*3, borderUISize, 'chestUI');
        this.tutorial1 = this.add.text(game.config.width/2, game.config.height/2 - borderUISize, 'Follow the sound,', gameText).setOrigin(0.5);
        this.tutorial2 = this.add.text(game.config.width/2, game.config.height/2, 'where ever it may be found...', gameText).setOrigin(0.5);
        
        //variables
        this.gameEnd = false;
        this.timeStart = false;
        this.nextLevel = false;
        this.timeEnd = 2000;
        this.digTimer = 3000;
        this.soundTimer = 0;
        this.detectMod = 2;
    }

    update(time, delta) {
        if(!this.gameEnd && !this.nextLevel){
            if(this.timeStart){
                timeScore -= delta;
                this.timeVal.text = Math.floor(timeScore/1000);
            }

            //metal detector timer
            if(this.soundTimer > 0){
                this.soundTimer -= delta;
            }

            if(this.digTimer > 0){
                this.digTimer -= delta;
            } else{
                //hide the tutorial text
                this.tutorial1.alpha = 0;
                this.tutorial2.alpha = 0;

                //start timer
                this.timeStart = true;

                //metal detector sound
                this.metalDetector();

                this.playerC.x = game.input.mousePointer.x;
                this.playerC.y = game.input.mousePointer.y;
                
                //mouse click
                if(game.input.mousePointer.buttons == 1){
                    if(this.checkCollision(this.playerC, this.lootA)){
                        this.lootA.alpha = 1;
                        chestCount += 1;
                        timeScore += 5000;
                        this.checkVal.text = chestCount;
                        this.lootA = this.add.image(Phaser.Math.Between(borderUISize*2, game.config.width - borderUISize*2), Phaser.Math.Between(borderUISize*2, game.config.height - borderUISize*2), 'chest').setOrigin(0.5);
                        this.lootA.alpha = 0;
                    }
                    this.digTimer = 2000;
                }
            }

            console.log(this.nextLevel);
            if(chestCount/chestDiv == 5){
                chestDiv += 1;
                this.nextLevel = true;
            }

            if(timeScore <= 0){
                this.timeVal.text = 0;
                this.gameEnd = true;
            }

        } else if(this.nextLevel){
            //learned reset scene from here
            //https://www.html5gamedevs.com/topic/35715-resetting-a-scene/
            this.scene.restart();
        } else if(this.gameEnd){
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
            this.soundTimer = 200;
        } else if(this.checkCollisionWide(this.playerC, this.lootA) && this.soundTimer <= 0){
            //detection is far
            this.sound.play('sfx_detected');
            this.soundTimer = 500;
        }
        return;
    }
}