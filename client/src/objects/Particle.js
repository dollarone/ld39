class Particle {

	constructor(game, group, x, y, hairdryer){
		this.game = game;
		this.sprite = group.create(x + this.game.rnd.integerInRange(-8, 8), y + this.game.rnd.integerInRange(-8, 8), 'ball');
		this.sprite.anchor.setTo(0.5, 0.5);
		this.sprite.scale.setTo(this.game.rnd.integerInRange(2, 20) * 0.03);

        this.sprite.body.gravity.y = 0;
        this.sprite.body.gravity.x = 0;


        this.sprite.body.velocity.x = -800 * Math.cos(hairdryer.angle/180*Math.PI);
        this.sprite.body.velocity.y = -800 * Math.sin(hairdryer.angle/180*Math.PI);
        
        this.sprite.body.collideWorldBounds = false;
        this.sprite.body.immovable = true;
        this.dead = false;
	}


}


export default Particle;