import Platform from "./platform.js";
import ScoreSystem from "./scoreSystem.js";
import PowerUp from "./powerUp.js";

export default class Player {
  constructor(scene, x, y, platform, powerUp) {
    this.scene = scene;
    this.platform = platform; // The platform object from platform.js
    this.powerUp = powerUp; // The power up object from powerUp.js

    this.jumpSound = this.scene.sound.add('jump');
    this.powerUpSFX = this.scene.sound.add('upCollect');
    this.effectOut = this.scene.sound.add('upOut');

    this.playerSpeed = 200;
    this.airJumpCount = 1;
    this.jumpForce = 300;
    this.airJumpForce = 300;

    this.isGround = false;
    this.isDead = false;
    this.state = 'idle';

    this.bounceForce = 350;
    this.airJumpResetValue = 1;
    this.platformSpawnTime = 500;

    this.player = scene.physics.add.sprite(x, y, "player").setScale(1);
    this.player.setCollideWorldBounds(true);
    //this.player.body.world.bounds.y = Number.NEGATIVE_INFINITY;
    this.player.body.world.bounds.height = Number.POSITIVE_INFINITY;
    this.player.setDepth(1);

    // Set up the collider with the platform
    this.scene.physics.add.collider(this.player, this.platform.platform, this.IsGround, null, this);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.SPACE,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      escape: Phaser.Input.Keyboard.KeyCodes.ESC,
    });
  }
  
  update() {
    this.PlayerMove();
    this.FallCheck()
    this.DifficultyUp();
    this.StateUpdate();
    
    if(this.powerUp.currentPowerUp != null)
    {
      // Set up the collider with the power up
      this.scene.physics.add.overlap(this.player, this.powerUp.currentPowerUp, this.CollectPowerUp, null, this);
    }
  }

  PlayerMove() {
    if (this.cursors.left.isDown || this.keys.left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
      this.state = 'moveLeft';
    } else if (this.cursors.right.isDown || this.keys.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
      this.state = 'moveRight';
    } else {
      this.player.setVelocityX(0);
      this.state = 'idle';
    }

    if (this.cursors.up.isDown || this.keys.up.isDown) {
      this.AirJump();
    }
  }

  IsGround = (playerObj, platformObj) => {
    this.isGround = true;
    this.GroundParticle(playerObj);
    ScoreSystem.AddScore();
    this.platform.destroyPlatform(); // Destroy the platform after collision

    // Add a delay before creating a new platform
    this.scene.time.delayedCall(this.platformSpawnTime, () => {
      const newPlatform = this.platform.addPlatform(); // Create a new platform
      this.scene.physics.add.collider(this.player, newPlatform, this.IsGround, null, this); // Add collision with the new platform

      // If the platform is bouncy, apply a higher bounce force
      if (newPlatform.isBouncy) {
        this.jumpForce = this.bounceForce;
      }
      if (newPlatform.isSpiked) {
        newPlatform.spikesSet.forEach(spike => {
          this.scene.physics.add.collider(this.player, spike, this.isSpiked, null, this);
        });
      }
    }, [], this);

    this.PlayerJump();
  }

  PlayerJump() {
    if (this.player.body.onFloor()) {
      this.player.setVelocityY(-this.jumpForce);
      this.jumpSound.play();
      this.isGround = false;
      this.jumpForce = 300;

      if(this.airJumpCount < 1) {
        this.airJumpCount += this.airJumpResetValue;
      }
      else {
        this.airJumpCount = 1;
      }
    }
  }

  AirJump() {
    if (this.airJumpCount >= 1) {
      this.GroundParticle(this.player);
      this.player.setVelocityY(-this.airJumpForce);
      this.jumpSound.play();
      this.airJumpCount--;
    }
  }

  CollectPowerUp = (player, powerUp) => 
  {
    // Destroy the power-up
    powerUp.destroy();
    this.powerUpSFX.play();
    PowerUp.powerUpCount--;

    // Destroy particle effects if they exist
    if (powerUp.emitter) {
        powerUp.emitter.startFollow(this.player);
      }
      
      // Apply speed boost
      this.playerSpeed *= 2;
      
      // Reset speed after 5 seconds
      this.scene.time.delayedCall(5000, () => {
        this.playerSpeed /= 2;
        powerUp.emitter.manager.destroy();
        this.effectOut.play();
    });
  };

  FallCheck() 
  {
    if (this.player.y > 600) {
      this.isDead = true;
    }
  }
  
  isSpiked = (playerObj, platformObj) => {
    this.isDead = true;
  }

  Restart() 
  {
    if (this.keys.enter.isDown) 
    {
      ScoreSystem.score = 0;
      PowerUp.powerUpCount = 0;
      this.scene.scene.restart();
    }
    if(this.keys.escape.isDown)
    {
      ScoreSystem.score = 0;
      PowerUp.powerUpCount = 0;
      this.scene.scene.start('MainMenuScene');
    }
  }

  DifficultyUp()
  {
    if(ScoreSystem.level === 0)
    {
      this.bounceForce = 350;
      this.platformSpawnTime = 500;
    }
    if(ScoreSystem.level === 1)
    {
      this.bounceForce = 400;
      this.platformSpawnTime = 600;
    }
    if(ScoreSystem.level === 2)
    {
      this.bounceForce = 450;
      this.platformSpawnTime = 700;
    }
    if(ScoreSystem.level === 3)
    {
      this.bounceForce = 500;
      this.platformSpawnTime = 800;
    }
    if(ScoreSystem.level === 4)
    {
      this.bounceForce = 550;
      this.platformSpawnTime = 900;
    }
    if(ScoreSystem.level === 5)
    {
      this.bounceForce = 600;
      this.platformSpawnTime = 1000;
    }
  }

  GroundParticle(target) {
    // Create particle emitter for ground collision
    const particles = this.scene.add.particles('dust');
    const emitter = particles.createEmitter({
      speed: 100,
      scale: { start: .5, end: 0 },
      blendMode: 'ADD'
    });

    emitter.setPosition(target.x, target.y);
    this.scene.time.delayedCall(400, () => {
      particles.destroy();
    });
  }

  StateUpdate()
  {
    if(this.state === 'idle')
    {
      this.player.play('Idle', true);
    }
    else if(this.state === 'moveLeft')
    {
      this.player.play('Move', true);
      this.player.setFlipX(true);
    }
    else if(this.state === 'moveRight')
    {
      this.player.play('Move', true);
      this.player.setFlipX(false);
    }
  }
}