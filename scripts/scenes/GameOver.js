class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    this.add.text(400, 200, 'Game Over', {
      fontSize: '48px',
      fill: '#ff0000'
    }).setOrigin(0.5);

    this.add.text(400, 260, 'Press SPACE to Restart', {
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('Level1'); 

      this.registry.set('score', 0);
      this.registry.set('coins', 0); //reset score and coins
    });
  }
}
