class Robot {

	constructor(game, frame, x, y, inspector) {
		this.game = game
		this.inspector = inspector
		this.sprite = this.game.add.sprite(x, y, 'tiles')
		this.sprite.anchor.setTo(0.5, 0.5)
		this.sprite.frame = frame
		this.sprite.inputEnabled = true
		this.sprite.events.onInputDown.add(this.onDown, this)
		if(this.sprite.frame == 5 || this.sprite.frame == 6 || this.sprite.frame == 12)  {
			this.name = "Factory"
			this.description = "\"Robots building robots. \nHow singular!\""
			this.attack = "N / A"
			this.defence = "N / A"
			this.battery = "N"
			this.maxBattery = "A"
			this.movement = "N / A"
			this.moveCost = "N / A"
			this.attackCost = "N / A"
			this.cost = "Various"
			this.canClaim = false
		}
		else if(this.sprite.frame == 7 || this.sprite.frame == 13) {
			this.name = "Bomb-on-wheels"
			this.description = "This unit explodes on\nattack, dealing damage to\nall adjacent units" +
            	"\n\n\"Bomb delivery for you Sir!\""
			this.attack = 2
			this.defence = 1
			this.battery = 1
			this.maxBattery = 1
			this.movement = 4
			this.moveCost = 1
			this.attackCost = 0
			this.cost = 100
			this.canClaim = false
		}
		if(this.sprite.frame<12) {
			this.faction = "Blue Sun"
		}
		else if(this.sprite.frame>=12) {
			this.faction = "Big E Corporate"
		}

		if(this.sprite.frame == 5) {
			this.description = "Claim this to build\nmore robots!"
		}
	}

	onDown() {
		this.inspector.inspect(this)

	}
	update() {
	}

}


export default Robot