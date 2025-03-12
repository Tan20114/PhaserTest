import Platform from "./platform.js";
import ScoreSystem from "./scoreSystem.js";
import PowerUp from "./powerUp.js";
import GameplayScene from "./gameplayScene.js";

export default class GameManager
{
    constructor(scene,player, platform, scoreSystem)
    {
        this.scene = scene;
        this.player = player;
        this.platform = platform;
        this.scoreSystem = scoreSystem;

        this.overSFX = this.scene.sound.add('gameOver');
        this.hasPlayedGameOverSFX = false;
    }

    Update()
    {
        this.player.update();
        this.GameOver();
        this.platform.update();
        ScoreSystem.Difficulty();
        this.scoreSystem.update();
    }

    GameOver()
    {
      if (this.player.isDead) {
        if(!this.hasPlayedGameOverSFX)
          {
            this.hasPlayedGameOverSFX = true;
            this.overSFX.play(); // ✅ Play only once
          }
        GameplayScene.bgm.pause();
        const style = { 
          fontSize: '64px', 
          fill: '#ff0000', 
          fontFamily: 'Arial', 
          stroke: '#000', 
          strokeThickness: 6 
        };
        const gameOverText = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY, 'Game Over', style);
        gameOverText.setOrigin(0.5, 0.5);
        const restartStyle = { 
          fontSize: '32px', 
          fill: '#fff', 
          fontFamily: 'Arial', 
          stroke: '#000', 
          strokeThickness: 4 
        };
        const restartText = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY + 80, '[Enter] to restart', restartStyle);
        restartText.setOrigin(0.5, 0.5);
        restartText.setStyle({ fontWeight: 'bold', fill: '#ff0' });
        const mainMenuText = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY + 120, '[Esc] to Main Menu', restartStyle);
        mainMenuText.setOrigin(0.5, 0.5);
        mainMenuText.setStyle({ fontWeight: 'bold', fill: '#ff0' });
        localStorage.setItem('highScore', ScoreSystem.highScore);
        this.scene.physics.pause();
        this.player.Restart();
        }
    }
}