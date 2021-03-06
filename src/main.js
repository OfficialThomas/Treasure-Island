let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play, End]
}

let game = new Phaser.Game(config);

//reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

//global stat vars
let timeScore = 180000;
let chestCount = 0;
let chestDiv = 1;
let digTimer = 0;

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;