class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        
    }

    create() {
        
    }

    update() {
        
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