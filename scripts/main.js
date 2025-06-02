const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene:[Level1,Level2,Level3,Congratulations,GameOver]
};
const game = new Phaser.Game(config);