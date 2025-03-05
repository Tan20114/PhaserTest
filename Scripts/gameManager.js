import Platform from "./platform.js";
import ScoreSystem from "./scoreSystem.js";
import PowerUp from "./powerUp.js";

export default class GameManager
{
    constructor(scene,player, platform, scoreSystem)
    {
        this.scene = scene;
        this.player = player;
        this.platform = platform;
        this.scoreSystem = scoreSystem;
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
            const gameOverText = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY, 'Game Over', 
            { 
              fontSize: '64px',
              fill: '#fff' 
            });
            gameOverText.setOrigin(0.5, 0.5);

            const restartText = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY + 80, 'Enter to restart', 
            { 
              fontSize: '32px',
              fill: '#fff' 
            });
            restartText.setOrigin(0.5, 0.5);

            const mainMenuText = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY + 120, 'Esc to Main Menu', 
            { 
              fontSize: '32px',
              fill: '#fff' 
            });
            mainMenuText.setOrigin(0.5, 0.5);

            localStorage.setItem('highScore', ScoreSystem.highScore);

            this.scene.physics.pause();
            this.player.Restart();
        }
    }
}