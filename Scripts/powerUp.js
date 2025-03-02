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
        if(PowerUp.powerUpCount === 0)
        {
            if (Phaser.Math.Between(1, 100) <= 50) { // 10% chance
                this.powerUp = this.scene.physics.add.sprite(Phaser.Math.Between(100, 700), 300, 'powerUp').setScale(0.25);
                this.scene.physics.add.overlap
                this.powerUp.setImmovable(true);
                this.powerUp.body.allowGravity = false;
                PowerUp.powerUpCount++;
            }
        }
        this.currentPowerUp = this.powerUp;
    }

    static update()
    {
        console.log(`Power-up count : ${this.powerUpCount}`);
    }
}