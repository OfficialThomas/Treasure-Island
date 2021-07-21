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
        this.load.image('ocean', './assets/water.png');
        this.load.image('island1', './assets/level-1.png');
        this.load.image('island2', './assets/level-2.png');
        this.load.image('island3', './assets/level-3.png');
        this.load.image('island4', './assets/level-4.png');

        //player
        this.load.spritesheet('idle', './assets/PlayerIdle-bird.png', { frameWidth: 32, frameHeight: 43 });
        this.load.spritesheet('dig', './assets/PlayerDigging-bird.png', { frameWidth: 32, frameHeight: 43 });
        this.load.spritesheet('found', './assets/PlayerTreasure3-bird.png', { frameWidth: 32, frameHeight: 43 });
        
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
            color: '#FFFFFF',
            //learned stroke and strokeThickness here:
            //https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Text.html
            stroke: '#000000',
            strokeThickness: 2,
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //background
        this.ocean = this.add.tileSprite(0, 0, 640, 480, 'ocean').setOrigin(0, 0);
        switch(chestDiv % 4){
            case 1:
                this.island = this.add.image(0, 0, 'island1').setOrigin(0, 0);
                break;
            case 2:
                this.island = this.add.image(0, 0, 'island2').setOrigin(0, 0);
                break;
            case 3:
                this.island = this.add.image(0, 0, 'island3').setOrigin(0, 0);
                break;
            case 0:
                this.island = this.add.image(0, 0, 'island4').setOrigin(0, 0);
                break;
            default:
                this.island = this.add.image(0, 0, 'island1').setOrigin(0, 0);
                break;
        }
        
        //player
        //player animations
        //reference https://labs.phaser.io/edit.html?src=src/animation/animation%20repeat%20event.js&v=3.55.2
        const idleAnimation = this.anims.create({ 
            key: 'blinking',
            frames: this.anims.generateFrameNumbers('idle'),
            frameRate: 12
        });
        const digAnimation = this.anims.create({ 
            key: 'digging',
            frames: this.anims.generateFrameNumbers('dig'),
            frameRate: 14
        });
        const detectAnimation = this.anims.create({ 
            key: 'detected',
            frames: this.anims.generateFrameNumbers('found'),
            frameRate: 14
        });
        this.playerC = this.add.sprite(game.config.width/2, game.config.height/2 + borderUISize*2, 'idle').setOrigin(0.75, 0.75);
        //this.playerC.play({key: 'blinking', repeat: -1});
        
        //chest
        this.lootA = this.add.image(Phaser.Math.Between(borderUISize*3, game.config.width - borderUISize*3), Phaser.Math.Between(borderUISize*3, game.config.height - borderUISize*3), 'chest').setOrigin(0.5);
        this.lootA.alpha = 0;

        //ui
        //time
        this.timeVal = this.add.text(borderUISize*4, borderUISize, Math.floor(timeScore/1000), gameText).setOrigin(0.5);
        //chests
        this.checkVal = this.add.text(game.config.width - borderUISize*1.5, borderUISize, chestCount, gameText).setOrigin(0.5);
        //text
        this.add.image(borderUISize*2, borderUISize, 'timeUI');
        this.add.image(game.config.width - borderUISize*3, borderUISize, 'chestUI');
        this.tutorial1 = this.add.text(game.config.width/2, game.config.height/2 - borderUISize, 'Follow the sound,', gameText).setOrigin(0.5);
        this.tutorial2 = this.add.text(game.config.width/2, game.config.height/2, 'where ever it may be found...', gameText).setOrigin(0.5);
        
        //variables
        this.gameEnd = false;
        this.gameStart = false;
        this.nextLevel = false;
        this.timeStart = 3000;
        this.timeEnd = 1500;
        this.soundTimer = 0;
        this.detectMod = 2;
    }

    update(time, delta) {
        //water flowing
        this.ocean.tilePositionX += 0.2;
        this.ocean.tilePositionY += 0.3;

        //start timer
        if(this.timeStart > 0){
            this.timeStart -= delta;
        } else {
            this.gameStart = true;
            //hide the tutorial text
            this.tutorial1.alpha = 0;
            this.tutorial2.alpha = 0;
        }
        
        if(!this.gameEnd && !this.nextLevel && this.gameStart){
            if(this.timeStart){
                timeScore -= delta;
                this.timeVal.text = Math.floor(timeScore/1000);
            }

            //metal detector timer
            if(this.soundTimer > 0){
                this.soundTimer -= delta;
            }

            if(digTimer > 0){
                digTimer -= delta;
            } else{
                //metal detector sound
                this.metalDetector();

                //movement
                this.playerC.x = game.input.mousePointer.x;
                this.playerC.y = game.input.mousePointer.y;
                //movement correction
                if(game.input.mousePointer.x < borderUISize*3){
                    this.playerC.x = borderUISize*3;
                } else if(game.input.mousePointer.x > game.config.width - borderUISize*3){
                    this.playerC.x = game.config.width - borderUISize*3;
                }
                if(game.input.mousePointer.y < borderUISize*3){
                    this.playerC.y = borderUISize*3;
                } else if(game.input.mousePointer.y > game.config.height - borderUISize*3){
                    this.playerC.y = game.config.height - borderUISize*3;
                }
                
                //mouse click
                if(game.input.mousePointer.buttons == 1){
                    this.sound.play('dig_sound');
                    if(this.checkCollision(this.playerC, this.lootA)){
                        this.lootA.alpha = 1;
                        chestCount += 1;
                        timeScore += 5000;
                        this.checkVal.text = chestCount;
                        this.lootA = this.add.image(Phaser.Math.Between(borderUISize*3, game.config.width - borderUISize*3), Phaser.Math.Between(borderUISize*3, game.config.height - borderUISize*3), 'chest').setOrigin(0.5);
                        this.lootA.alpha = 0;
                    }
                    digTimer = 1000;
                }
            }

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

    //adjusted method from rocket patrol
    checkCollisionMax(rocket, ship){
        //simple AABB checking
        if (rocket.x < ship.x + ship.width*this.detectMod*2 && rocket.x + rocket.width*this.detectMod*2 > ship.x && rocket.y < ship.y + ship.height*this.detectMod*2 && rocket.height*this.detectMod*2 + rocket.y > ship.y){
            return true;
        } else {
            return false;
        }
    }

    metalDetector(){
        if(this.checkCollision(this.playerC, this.lootA) && this.soundTimer <= 0){
            //detection is close
            this.sound.play('sfx_detected');
            this.soundTimer = 100;
        } else if(this.checkCollisionWide(this.playerC, this.lootA) && this.soundTimer <= 0){
            //detection is near
            this.sound.play('sfx_detected');
            this.soundTimer = 300;
        } else if(this.checkCollisionMax(this.playerC, this.lootA) && this.soundTimer <= 0){
            //detection is far
            this.sound.play('sfx_detected');
            this.soundTimer = 500;
        }
        return;
    }
}