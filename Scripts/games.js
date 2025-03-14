import MainMenuScene from "./mainMenuScene.js";
import GameplayScene from "./gameplayScene.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "rgb(0,255,0)",
    parent: "game-container",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            //debug: true,
        },
    },
    scene: [MainMenuScene,GameplayScene],
};

new Phaser.Game(config);