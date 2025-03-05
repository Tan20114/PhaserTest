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
    }

    create() {
        this.paralax = new Paralax(this);
        // UI
        const scoreTxt = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#fff' });
        const highScoreTxt = this.add.text(500, 10, 'High Score: 0', { fontSize: '32px', fill: '#fff' });
        this.airJumpTxt = this.add.text(10, 50, 'Air Jumps: 1', { fontSize: '32px', fill: '#fff' });
        this.levelTxt = this.add.text(625, 50, 'Level: 1', { fontSize: '32px', fill: '#fff' });
        scoreTxt.setScrollFactor(0);
        highScoreTxt.setScrollFactor(0);
        this.airJumpTxt.setScrollFactor(0);

        // System Reference
        this.scoreSystem = new ScoreSystem(this, scoreTxt, highScoreTxt, this.levelTxt);
        this.powerUp = new PowerUp(this);
        this.platform = new Platform(this);
        this.player = new Player(this, 100, 400, this.platform, this.powerUp);
        this.gameManager = new GameManager(this, this.player, this.platform, this.scoreSystem);

    }

    update() {
        this.gameManager.Update();
        this.airJumpTxt.setText(`Air Jumps: ${this.player.airJumpCount === 1 ? 1 : 0}`); // Update the air jump text
        this.paralax.BackgroundUpdate();
        this.paralax.ParalaxMove(this.player.playerSpeed);
    }
}