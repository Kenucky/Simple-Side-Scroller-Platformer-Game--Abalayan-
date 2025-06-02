class Level3 extends Phaser.Scene {
  constructor() {
    super('Level3');
  }

  init(data) {
    this.lives = data.lives || 3;
  }

  preload() {
    this.load.image('tiles', 'assets/tilesets/CastleTileSet.png');
    this.load.tilemapTiledJSON('map3', 'assets/tilemaps/level3.json');
    this.load.spritesheet('player', 'assets/sprites/player.png', {frameWidth: 32,frameHeight: 48});
    this.load.image('coin', 'assets/tilesets/Icon31.png'); 
    this.load.image('bg1', 'assets/tilesets/DevilCoinTileset.png');
    this.load.image('spike', 'assets/tilesets/Dungeon_27.png');
    this.load.image('goal', 'assets/tilesets/Dungeon_09.png');
  }

  create() {
    //create tilemaps and layers
    const map = this.make.tilemap({ key: 'map3', tileWidth: 32, tileHeight: 32 });
    const tileset = map.addTilesetImage('castletiles', 'tiles');
    
    const backgroundTileset = map.addTilesetImage('castletiles', 'tiles');
    const backgroundLayer = map.createLayer('Background', backgroundTileset);

    const wallDecorTileset = map.addTilesetImage('castletiles', 'tiles');
    const wallDecorLayer = map.createLayer('WallDecor', wallDecorTileset);
    
    const obstaclesTileset = map.addTilesetImage('castletiles', 'tiles');
    const obstaclesLayer = map.createLayer('Obstacles', obstaclesTileset);

    const groundLayer = map.createLayer('Ground', tileset);
    groundLayer.setCollisionByProperty({ collides: true });

    //spikes group (object)
    this.spikes = this.physics.add.staticGroup();
    const spikeObjects = map.getObjectLayer('Spikes').objects;
    spikeObjects.forEach((obj) => {
      const spike = this.spikes.create(obj.x,obj.y - obj.height,'spike');
      spike.setOrigin(0, 0);
      spike.body.setSize(obj.width, obj.height);
      spike.body.setOffset(0, 0);
    });
    
    //coins group (object)
    this.coins = this.physics.add.staticGroup();
    this.coins = this.physics.add.group();
    map.getObjectLayer('Coins').objects.forEach((coinData) => {
      const coin = this.coins.create(coinData.x, coinData.y - 32, 'coin');
      coin.body.setAllowGravity(false);
      coin.setOrigin(0, 0);
    });

    //goal group (object)
    this.goal = this.physics.add.staticGroup();
    const goalObjects = map.getObjectLayer('Goal').objects;
    goalObjects.forEach((obj) => {
      const goal = this.goal.create(obj.x, obj.y - obj.height, 'goal');
      goal.setOrigin(0, 0);
    });

    //player 
    this.player = this.physics.add.sprite(100, -100, 'player');
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, groundLayer);
    this.physics.add.collider(this.player, obstaclesLayer);

  
    this.cursors = this.input.keyboard.createCursorKeys();


    //collisions
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.spikes, this.hitSpike, null, this);
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);
    this.physics.add.overlap(this.player, this.spikes, this.loseLife, null, this);
    groundLayer.setCollisionBetween(0,55);
    obstaclesLayer.setCollisionBetween(0,55);

    //score and coin counter
    if (!this.registry.has('score')) {
      this.registry.set('score', 0);
    }
    if (!this.registry.has('coins')) {
      this.registry.set('coins', 0);
    }

    this.scoreText = this.add.text(16, 16, 'Score: ' + this.registry.get('score'), {
      fontSize: '18px', fill: '#fff'
    }).setScrollFactor(0);

    this.coinText = this.add.text(16, 40, 'Coins: ' + this.registry.get('coins'), {
      fontSize: '18px', fill: '#fff'
    }).setScrollFactor(0);


    //lives counter
    this.livesText = this.add.text(16, 64, 'Lives: ' + this.lives, {
      fontSize: '18px',
      fill: '#fff'
    }).setScrollFactor(0);

    //camera & world bounds to not see black edges
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.flipX = false;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.flipX = true;
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-400);
    }
  }

  collectCoin(player, coin) {
    coin.destroy();

    this.registry.set('score', this.registry.get('score') + 10);
    this.registry.set('coins', this.registry.get('coins') + 1);

    this.scoreText.setText('Score: ' + this.registry.get('score'));
    this.coinText.setText('Coins: ' + this.registry.get('coins'));
  }

  hitSpike(player, spike) {
    this.physics.add.collider(this.player, this.spikes, () => {
    this.loseLife();
  }, null, this);
}

  reachGoal(player, goal) {
    this.scene.start('Congratulations'); 
  }

  loseLife() {
    if (this.losingLife) return; 
    this.losingLife = true;

    this.lives--;
    this.livesText.setText('Lives: ' + this.lives);

    if (this.lives <= 0) {
      this.scene.start('GameOver');
    } else {
      // flash red and reset player
      this.player.setTint(0xff0000);
      this.player.setVelocity(0, 0);

      this.time.delayedCall(1000, () => {
        this.player.clearTint();
        this.player.setPosition(100, -500); // reset position
        this.losingLife = false;
      });
    }
  }
}


