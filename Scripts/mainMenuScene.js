export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // Load assets here
        //this.load.image('background', 'assets/background.png');
        //this.load.image('playButton', 'assets/playButton.png');
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background');

        // Add play button
        const playButton = this.add.image(400, 300, 'playButton').setInteractive();

        // Add button click event
        playButton.on('pointerdown', () => {
            this.scene.start('GameplayScene');
        });

        // Add title text
        this.add.text(400, 150, 'Main Menu', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    }
}