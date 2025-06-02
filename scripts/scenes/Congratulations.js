class Congratulations extends Phaser.Scene {
  constructor() {
    super('Congratulations');
  }

  create() {
    this.add.text(200, 200, '🎉 Congratulations! 🎉', {
      fontSize: '32px', fill: '#fff'
    });

    const finalScore = this.registry.get('score') || 0;
    const totalCoins = this.registry.get('coins') || 0;

    this.add.text(200, 260, 'Final Score: ' + finalScore, {
      fontSize: '24px', fill: '#fff'
    });

    this.add.text(200, 300, 'Total Coins: ' + totalCoins, {
      fontSize: '24px', fill: '#fff'
    });

    this.add.text(200, 360, 'Press SPACE to Restart', {
      fontSize: '18px', fill: '#ccc'
    });

    this.input.keyboard.once('keydown-SPACE', () => {
      // Reset registry before restarting
      this.registry.set('score', 0);
      this.registry.set('coins', 0);
      this.scene.start('Level1');
    });
  }
}
