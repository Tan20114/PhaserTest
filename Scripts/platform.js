import ScoreSystem from "./scoreSystem.js";

export default class Platform {
    constructor(scene) {
        this.scene = scene;
        
        // Create a group to store all platforms
        this.platform = this.scene.physics.add.staticGroup(); // Static platforms
        this.movingPlatforms = []; // Track moving platforms
        
        // Platform properties
        this.xGap = 200;
        this.yLevel = 500;
        this.isFirstPlatform = true;
        this.maxPlatformScale = 1;
        
        // Moving platform properties
        this.platformTravelPath = 100; // Travel distance for moving platforms
        this.platformTravelTime = 3000; // Travel time
        
        this.platformChance = 25;

        this.newSpike;

        // Add initial platform
        this.addPlatform();

        // Create a destroying platform
        this.destroyingPlatform = this.createDestroyingPlatform();
    }

    update() {
        this.DifficultyUp();
    }

    addPlatform() {
        let platform;
        if (this.isFirstPlatform) 
        {
            platform = this.platform.create(400, this.yLevel, 'platform').setScale(4, 1).refreshBody();
            this.isFirstPlatform = false;
        }
        else 
        {
            const platformType = Phaser.Math.Between(1, 100);
            if (platformType <= this.platformChance) {
            platform = this.createMovingPlatform();
            } else if (platformType <= this.platformChance * 2) {
            platform = this.createBouncyPlatform();
            } else if (platformType <= this.platformChance * 3) {
            platform = this.createSpikedPlatform();
            } else {
            platform = this.createNormalPlatform();
            }
        }

        return platform;
    }

    createNormalPlatform() {
        const x = Phaser.Math.Between(200, 600);
        const y = this.yLevel;
        const scaleX = this.maxPlatformScale;
        const scaleY = 1;

        return this.platform.create(x, y, 'platform').setScale(scaleX, scaleY).refreshBody();
    }

    createMovingPlatform() {
        const x = Phaser.Math.Between(300, 500);
        const y = this.yLevel;
        const scaleX = .5;
        const scaleY = 1;

        const platform = this.scene.physics.add.sprite(x, y, 'platform').setScale(scaleX, scaleY);
        platform.setImmovable(true);
        platform.body.allowGravity = false;

        const travelDistance = Phaser.Math.Between(0, 1) === 0 ? -this.platformTravelPath : this.platformTravelPath;

        const tween = this.scene.tweens.add({
            targets: platform,
            x: x + travelDistance,
            ease: 'Sine.easeInOut',
            duration: this.platformTravelTime,
            yoyo: true,
            repeat: -1
        });

        this.movingPlatforms.push({ platform, tween });
        return platform;
    }

    createBouncyPlatform() {
        const x = Phaser.Math.Between(200, 600);
        const y = this.yLevel;
        const scaleX = this.maxPlatformScale;
        const scaleY = 1;

        const platform = this.platform.create(x, y, 'bouncePlat').setScale(scaleX, scaleY).refreshBody();

        platform.isBouncy = true;

        return platform;
    }

    createSpikedPlatform() {
        const x = Phaser.Math.Between(200, 600);
        const y = this.yLevel;
        const scaleX = this.maxPlatformScale;
        const scaleY = 1;

        const platform = this.platform.create(x, y, 'platform').setScale(scaleX, scaleY).refreshBody();

        let spikeCount = 0;

        if(scaleX <= 0.2) 
        {
            spikeCount = 1; // Randomly decide the number of spikes
        }
        else
        {
            spikeCount = Phaser.Math.Between(1, 2); // Randomly decide the number of spikes
        }
        platform.spikes = [];

        let lastSpikeX = null;
        for (let i = 0; i < spikeCount; i++) {
            let spikeX;
            do {
            spikeX = x + Phaser.Math.Between(-platform.displayWidth / 2, platform.displayWidth / 2);
            } while (lastSpikeX !== null && Math.abs(spikeX - lastSpikeX) < 50);

            const spike = this.scene.add.sprite(spikeX, y - 30, 'spike').setScale(0.05);
            this.scene.physics.add.existing(spike);
            spike.body.allowGravity = true;

            this.scene.physics.add.collider(platform, spike);

            this.scene.physics.add.overlap(spike, this.destroyingPlatform, () => {
            spike.destroy(); // Destroy the spike itself
            });

            platform.spikes.push(spike);
            lastSpikeX = spikeX;
        }

        platform.isSpiked = true;
        platform.spikesSet = platform.spikes;

        return platform;
    }

    destroyPlatform() {
        // Destroy static platforms
        this.platform.getChildren().forEach(platform => {
            if (!platform.isDestroying) {
                platform.destroy();
            }
        });

        // Destroy moving platforms and their tweens
        this.movingPlatforms.forEach(({ platform, tween }) => {
            tween.stop();
            platform.destroy();
        });

        this.movingPlatforms = [];
    }

    createDestroyingPlatform() { // Create a platform that destroys all other object
        const x = 400;
        const y = 700;
        const scaleX = 10;
        const scaleY = 0.25;

        const platform = this.platform.create(x, y, 'platform').setScale(scaleX, scaleY).refreshBody();
        platform.setTint(0xff0000); // Red color for better visibility
        platform.isDestroying = true;

        return platform;
    }

    DifficultyUp()
    {
        if(ScoreSystem.level === 0)
        {
            // Move platform faster
            this.platformTravelTime = 3000;
            this.platformTravelPath = 100;
            this.maxPlatformScale = 1;

            this.platformChance = 25;
        }
        if(ScoreSystem.level === 1)
        {
            // Move platform faster
            this.platformTravelTime = 2500;
            this.platformTravelPath = 150;
            this.maxPlatformScale = .875;

            this.platformChance = 26;
        }
        if(ScoreSystem.level === 2)
        {
            this.platformTravelTime = 2000;
            this.platformTravelPath = 200;
            this.maxPlatformScale = 0.75;

            this.platformChance = 27;
        }
        if(ScoreSystem.level === 3)
        {
            // Move platform faster
            this.platformTravelTime = 1500;
            this.platformTravelPath = 250;
            this.maxPlatformScale = .625;

            this.platformChance = 28;
        }
        if(ScoreSystem.level === 4)
        {
            // Move platform faster
            this.platformTravelTime = 1000;
            this.platformTravelPath = 250;
            this.maxPlatformScale = .5;

            this.platformChance = 29;
        }
        if(ScoreSystem.level === 5)
        {
            this.platformTravelTime = 1000;
            this.platformTravelPath = 250;
            this.maxPlatformScale = .375;

            this.platformChance = 30;
        }
    }
}
