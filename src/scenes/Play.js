class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load any art for the scene here
        this.load.image('temp_island', './assets/temp_island.png');
        
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

        //background
        this.island = this.add.image(borderUISize*-4, 0, 'temp_island').setOrigin(0, 0);
        this.island.scale = 0.75;
        this.add.text(game.config.width/2, game.config.height/2, 'Play Scene', gameText).setOrigin(0.5);

        //background game objects (props)
        
        //player game objects
        this.playerC = this.add.rectangle(game.config.width/2, game.config.height/2, borderUISize, borderUISize, 0xF5E050).setOrigin(0.5);
        this.lootA = this.add.rectangle(Phaser.Math.Between(borderUISize, game.config.width - borderUISize), Phaser.Math.Between(borderUISize, game.config.height - borderUISize), borderUISize, borderUISize, 0xF50000).setOrigin(0.5);
        this.lootA.alpha = 0;
        
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