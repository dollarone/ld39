class Robot {

	constructor(game, frame, x, y, mapX, mapY, inspector) {
		this.game = game
		this.inspector = inspector
		this.sprite = this.game.add.sprite(x, y, 'tiles')
		this.sprite.anchor.setTo(0.5, 0.5)
		this.sprite.frame = frame
		this.sprite.inputEnabled = true
		this.sprite.input.useHandCursor = true
		this.sprite.events.onInputDown.add(this.onDown, this)
		this.mapX = mapX
		this.mapY = mapY
		this.dead = false

		if(this.sprite.frame == 5 || this.sprite.frame == 6 || this.sprite.frame == 12)  {
			this.name = "Factory"
			this.description = "\"Robots building robots. \nHow singular!\""
			this.attack = "N / A"
			this.defence = "N"

			this.battery = 1
			this.maxBattery = 10
			this.movement = "N / A"
			this.moveCost = "N / A"
			this.attackCost = "N / A"
			this.range = "N / A"
			this.cost = "Various"
			this.canClaim = false
			this.weapon = "N / A"
			this.faction = "Neutral"
		}
		else if(this.sprite.frame == 7 || this.sprite.frame == 13) {
			this.name = "Bomb-on-wheels"
			this.description = "This unit explodes on\nattack, dealing damage to\nall adjacent units" +
            	"\n\n\"Bomb delivery for you Sir!\""
			this.attack = 2
			this.defence = 1
			this.maxBattery = 4
			this.movement = 1
			this.moveCost = 1
			this.attackCost = 0
			this.cost = 1
			this.range = 1
			this.canClaim = false
			this.weapon = "ACME 36-inch bomb"
		}
		else if(this.sprite.frame == 8 || this.sprite.frame == 14) {
			this.name = "Devastator"
			this.description = "Small and fragile -\nbut carries a Big Gun"
			this.attack = 1
			this.defence = 1
			this.maxBattery = 3
			this.movement = 1
			this.moveCost = 1
			this.attackCost = 1
			this.cost = 1
			this.range = 1
			this.canClaim = true
			this.weapon = "M134 Minigun"
		}
		else if(this.sprite.frame == 9 || this.sprite.frame == 15) {
			this.name = "Obliterator"
			this.description = "An AI encased in heavy armour.\nThe cannon does significant\ndamage - but requires a lot\nof battery."
			this.attack = 5
			this.defence = 8
			this.maxBattery = 7
			this.movement = 1
			this.moveCost = 1
			this.attackCost = 4
			this.cost = 3
			this.range = 3
			this.specialRange = "1 - 3"
			this.canClaim = false
			this.weapon = "Large-calibre cannon"
		}
		else if(this.sprite.frame == 10 || this.sprite.frame == 16) {
			this.name = "Eradicator"
			this.description = "Fully charged, the Eradicator\ncan quickly dispose of a small \narmy on its own."
			this.attack = 2
			this.defence = 5
			this.maxBattery = 7
			this.movement = 1
			this.moveCost = 1
			this.attackCost = 1
			this.cost = 3
			this.range = 1
			this.canClaim = true
			this.weapon = "Twin laser guns"
		}
		else if(this.sprite.frame == 11 || this.sprite.frame == 17) {
			this.name = "Annihilator"
			this.description = "Also known as the bomb\ndistribution service.\n\n\"Careful with that Annihilator,\n Eugene!\""
			this.attack = 2
			this.defence = 5
			this.maxBattery = 6
			this.movement = 1
			this.moveCost = 1
			this.attackCost = 3
			this.cost = 4
			this.range = 3
			this.specialRange = "2 - 3"
			this.canClaim = false
			this.weapon = "Mortar armed with\nACME 36-inch bombs"
		}
		if(this.sprite.frame<12 && this.sprite.frame != 5) {
			this.faction = "Blue Sun"
		}
		else if(this.sprite.frame>=12) {
			this.faction = "Big E Corporate"
		}

		if(this.sprite.frame == 5) {
			this.battery = 0
			this.maxBattery = 5
		}
		this.maxDefence = this.defence
		if(!(this.sprite.frame == 5 || this.sprite.frame == 6 || this.sprite.frame == 12))  {
			this.battery = this.maxBattery
		}
		else {
			this.maxDefence = "A"
		}
	}

	onDown() {
		this.inspector.inspect(this)

	}
	update() {
	}

}


export default Robot
