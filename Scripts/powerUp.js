export default class PowerUp {
    static powerUpCount = 0;
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.currentPowerUp = null;
        this.spawnPowerUp();
        this.scene.time.addEvent({
            delay: 10000, // 10 seconds
            callback: this.spawnPowerUp,
            callbackScope: this,
            loop: true
        });
    }

    spawnPowerUp() {
        if (PowerUp.powerUpCount === 0) {
            if (Phaser.Math.Between(1, 100) <= 25) { // 10% chance
                this.powerUp = this.scene.physics.add.sprite(Phaser.Math.Between(100, 700), 300, 'powerUp').setScale(0.25);
                this.powerUp.setImmovable(true);
                this.powerUp.body.allowGravity = false;
                PowerUp.powerUpCount++;
    
                // Add particles
                this.particles = this.scene.add.particles('particleImage'); 
                this.emitter = this.particles.createEmitter({
                    speed: 100,
                    scale: { start: 0.25, end: 0 },
                    blendMode: 'ADD'
                });
    
                this.emitter.startFollow(this.powerUp);
                this.powerUp.emitter = this.emitter; // Store emitter in the power-up object
            }
        }
        this.currentPowerUp = this.powerUp;
    }    
}