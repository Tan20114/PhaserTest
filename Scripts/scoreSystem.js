export default class ScoreSystem 
{
    static highScore = 0;
    static score = 0;
    static previousScore = 0;
    static scoreText = null; // Make scoreText static
    static highScoreTxt = null;
    static levelTxt = null;
    static level = 1;

    static scoreChanged = false;

    constructor(scene, scoreTxt, highScoreTxt, levelTxt) 
    {
        this.scene = scene;
        ScoreSystem.scoreText = scoreTxt; // Set scoreText statically
        ScoreSystem.highScoreTxt = highScoreTxt;
        ScoreSystem.levelTxt = levelTxt;

    }

    update() 
    {
        if(ScoreSystem.score > ScoreSystem.highScore) 
        {
            ScoreSystem.highScore = ScoreSystem.score;
        }
        ScoreSystem.scoreText.setText(`Score: ${ScoreSystem.score.toString().padStart(3, '0')}`);
        ScoreSystem.highScoreTxt.setText(`High Score: ${ScoreSystem.highScore.toString().padStart(3, '0')}`);
        ScoreSystem.levelTxt.setText(`Level: ${ScoreSystem.level}`);
    }

    static AddScore() 
    {
        this.previousScore = this.score;
        this.score += 1;
        this.hasScoreChanged();
    }

    static Difficulty() 
    {
        if(this.score === 0) 
        {
            this.level = 0;
        }
        if(this.score >= 10) 
        {
            this.level = 1;
        }
        if(this.score >= 25) 
        {
            this.level = 2;
        }

        if(this.score >= 50) 
        {
            this.level = 3;
        }

        if(this.score >= 80) 
        {
            this.level = 4;
        }

        if(this.score >= 120) 
        {
            this.level = 5;
        }
    }

    static hasScoreChanged() 
    {
        if(this.score !== this.previousScore)
        {
            this.scoreChanged = true;
        }
    }
}
