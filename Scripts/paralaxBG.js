import ScoreSystem from "./scoreSystem.js";

export default class Paralax
{
    constructor(scene)
    {


        this.scene = scene;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.key = this.scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W
        });

        this.isBGChanged = false;

        // Background
        this.sky = this.scene.add.tileSprite(0, -1400, 1000, 2000, 'sky').setOrigin(0,0);
        this.back = this.scene.add.tileSprite(0, -1400, 1000, 2000, 'backGround').setOrigin(0,0);
        this.mid = this.scene.add.tileSprite(0, -1400, 1000, 2000, 'midGround').setOrigin(0,0);
        this.fore = this.scene.add.tileSprite(0, -1400, 1000, 2000, 'foreGround').setOrigin(0,0);
    }

    BackgroundUpdate()
    {
        if(ScoreSystem.score >= 30 && !this.isBGChanged)
        {
            this.back.setTexture('backGround2');
            this.mid.setTexture('midGround2');
            this.fore.setTexture('fore2');
            this.sky.setTexture('sky2');
            this.isBGChanged = true;
        }
    }

    ParalaxMoveGame(num,num2)
    {
        if (this.cursors.left.isDown || this.key.left.isDown) {
            this.sky.tilePositionX -= .1;
            this.back.tilePositionX -= .2;
            this.mid.tilePositionX -= .5;
            this.fore.tilePositionX -= 1;
        } else if (this.cursors.right.isDown || this.key.right.isDown) {
            this.sky.tilePositionX += .1;
            this.back.tilePositionX += .2;
            this.mid.tilePositionX += .5;
            this.fore.tilePositionX += 1;
        } else {
            // No movement
        }
        if (ScoreSystem.scoreChanged) {
            let tweenTime = 700
            //Foregound
            this.scene.tweens.add({
            targets: this.fore,
            tilePositionY: this.fore.tilePositionY - 15,
            ease: 'Power1',
            duration: tweenTime,
            onComplete: () => {
                ScoreSystem.scoreChanged = false;
            }
            });

            // Midground
            this.scene.tweens.add({
                targets: this.mid,
                tilePositionY: this.fore.tilePositionY - 10,
                ease: 'Power1',
                duration: tweenTime,
                onComplete: () => {
                    ScoreSystem.scoreChanged = false;
                }
            });

            // Background
            this.scene.tweens.add({
                targets: this.back,
                tilePositionY: this.fore.tilePositionY - 8,
                ease: 'Power1',
                duration: tweenTime,
                onComplete: () => {
                    ScoreSystem.scoreChanged = false;
                }
            });

            // Sky
            this.scene.tweens.add({
                targets: this.sky,
                tilePositionY: this.fore.tilePositionY - 4,
                ease: 'Power1',
                duration: tweenTime,
                onComplete: () => {
                    ScoreSystem.scoreChanged = false;
                }
            });
        }
    }

    ParalaxMove(num)
    {
        this.sky.tilePositionX -= .1;
        this.back.tilePositionX -= .2;
        this.mid.tilePositionX -= .5;
        this.fore.tilePositionX -= 1;
    }
}
