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
        PowerUp.update();
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
            this.scene.physics.pause();
            this.player.Restart();
        }
    }
}