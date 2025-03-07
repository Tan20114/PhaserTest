import Platform from "./platform.js";
import Player from "./player.js";
import ScoreSystem from "./scoreSystem.js";
import GameManager from "./gameManager.js";
import PowerUp from "./powerUp.js";
import Paralax from "./paralaxBG.js";

export default class GameplayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameplayScene' });
    }

    preload() {
        // Entity
        this.load.image("player", "./Asset/Sprite/Combiner.png");
        this.load.image("platform", "./Asset/Sprite/Platform.png");
        this.load.image('spike', './Asset/Sprite/spike.png');
        this.load.image('powerUp', './Asset/Sprite/powerUp.png');
        this.load.spritesheet('powerUpSheet', './Asset/Sprite/powerUpsheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('bouncePlat', './Asset/Sprite/BouncyPlatform.png');

        //Background
        this.load.image('foreGround', './Asset/Sprite/Background/F1.png');
        this.load.image('fore2', './Asset/Sprite/Background/F2.png')
        this.load.image('midGround', './Asset/Sprite/Background/M1.png');
        this.load.image('midGround2', './Asset/Sprite/Background/M2.png');
        this.load.image('backGround', './Asset/Sprite/Background/B1.png');
        this.load.image('backGround2', './Asset/Sprite/Background/B2.png');
        this.load.image('sky', './Asset/Sprite/Background/BGColor.png');
        this.load.image('sky2', './Asset/Sprite/Background/BGColor2.png');
        this.load.image('lava', './Asset/Sprite/Background/LavaFirst.png');

        // Element
        this.load.spritesheet('lavaSheet', './Asset/Sprite/Background/LavaSheet.png', {frameWidth: 800,frameHeight: 600});
        this.load.image('dust', './Asset/Sprite/GroundParticle.png');
    }

    create() {
        // Animation
        this.anims.create({
            key: 'powerUpAnim',
            frames: this.anims.generateFrameNumbers('powerUpSheet', { start: 0, end: 24 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'lavaAnim',
            frames: this.anims.generateFrameNumbers('lavaSheet', { start: 0, end: 15 }),
            frameRate: 5,
            repeat: -1
        });

        this.paralax = new Paralax(this);
        // UI
        const style = { fontSize: '32px', fill: '#fff', stroke: '#000', strokeThickness: 4 };
        const scoreTxt = this.add.text(10, 10, 'Score: 0', style);
        const highScoreTxt = this.add.text(500, 10, 'High Score: 0', style);
        this.airJumpTxt = this.add.text(10, 50, 'Air Jumps: 1', style);
        this.levelTxt = this.add.text(625, 50, 'Level: 1', style);
        scoreTxt.setScrollFactor(0);
        highScoreTxt.setScrollFactor(0);
        this.airJumpTxt.setScrollFactor(0);

        // System Reference
        this.scoreSystem = new ScoreSystem(this, scoreTxt, highScoreTxt, this.levelTxt);
        this.powerUp = new PowerUp(this);
        this.platform = new Platform(this);
        this.player = new Player(this, 100, 400, this.platform, this.powerUp);
        this.gameManager = new GameManager(this, this.player, this.platform, this.scoreSystem);

        this.lava = this.add.sprite(0, 0, 'lava').setOrigin(0, 0);
        this.lava.anims.play('lavaAnim');
        this.lava.setDepth(2);
    }

    update() {
        this.gameManager.Update();
        this.airJumpTxt.setText(`Air Jumps: ${this.player.airJumpCount === 1 ? 1 : 0}`); // Update the air jump text
        this.paralax.BackgroundUpdate();
        this.paralax.ParalaxMoveGame(1,1);
    }
}