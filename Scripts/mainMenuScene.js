import ScoreSystem from "./scoreSystem.js";
import Paralax from "./paralaxBG.js";

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }


    preload() {
        this.load.image('logo', './Asset/Sprite/Logo.png');

        // Background
        this.load.image('foreGround', './Asset/Sprite/Background/F1.png');
        this.load.image('fore2', './Asset/Sprite/Background/F2.png');
        this.load.image('midGround', './Asset/Sprite/Background/M1.png');
        this.load.image('midGround2', './Asset/Sprite/Background/M2.png');
        this.load.image('backGround', './Asset/Sprite/Background/B1.png');
        this.load.image('backGround2', './Asset/Sprite/Background/B2.png');
        this.load.image('sky', './Asset/Sprite/Background/BGColor.png');
        this.load.image('sky2', './Asset/Sprite/Background/BGColor2.png');
        this.load.image('lava', './Asset/Sprite/Background/LavaFirst.png');

        // Sound
        this.load.audio('bgm','./Asset/Sound/bgm.mp3');

        // Lava animation
        this.load.spritesheet('lavaSheet', './Asset/Sprite/Background/LavaSheet.png', {
            frameWidth: 800,
            frameHeight: 600
        });
    }

    create() {
        this.bgm = this.sound.add('bgm');
        this.bgm.setLoop(true);
        this.bgm.play()

        // Lava Anim
        this.anims.create({
            key: 'lavaAnim',
            frames: this.anims.generateFrameNumbers('lavaSheet', { start: 0, end: 15 }),
            frameRate: 5,
            repeat: -1
        });
        
        // Background effect
        this.paralax = new Paralax(this);
        this.cameras.main.fadeIn(1000, 0, 0, 0); // Smooth fade-in

        // Load high score from localStorage
        ScoreSystem.highScore = localStorage.getItem('highScore') || 0;

        // Title logo animation
        const logo = this.add.image(400, 130, 'logo')
            .setOrigin(0.5)
            .setScale(0.9);
        
        this.tweens.add({
            targets: logo,
            scale: 1,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // High Score Text
        this.add.text(400, 220, `High Score: ${ScoreSystem.highScore}`, {
            fontSize: '36px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4,
            shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 4, fill: true }
        }).setOrigin(0.5);

        // Play button with better UI
        const playButtonBg = this.add.rectangle(400, 300, 140, 50, 0xffd700, 0.8)
            .setOrigin(0.5)
            .setStrokeStyle(4, 0x000000, 1)
            .setInteractive();

        const playButtonText = this.add.text(400, 300, 'PLAY', {
            fontSize: '32px',
            fill: '#000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        playButtonBg.on('pointerover', () => {
            playButtonBg.setFillStyle(0xffffff);
            playButtonText.setFill('#000');
        });

        playButtonBg.on('pointerout', () => {
            playButtonBg.setFillStyle(0xffd700);
            playButtonText.setFill('#000');
        });

        playButtonBg.on('pointerdown', () => {
            this.bgm.pause();
            this.scene.start('GameplayScene');
        });

        this.lava = this.add.sprite(0, 0, 'lava').setOrigin(0, 0);
        this.lava.anims.play('lavaAnim');
    }

    update() {
        this.paralax.ParalaxMove(1);
    }
}