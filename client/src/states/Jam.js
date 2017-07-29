class Jam extends Phaser.State {

	init(colour = "#aaa", timeout = 3) {
		this.colour = colour
		this.timeout = timeout
	}

	create() {	
		
	    let yam = this.game.add.sprite(this.game.width/2, this.game.height/2, 'onehourgamejamlogo')
	    yam.anchor.setTo(0.5)
	    yam.scale.setTo(yam.width/this.game.width/20)

	    this.game.stage.backgroundColor = this.colour

	    this.splashMusic = this.game.add.audio('onehourgamejamsplash')
	    this.splashMusic.play()

	    this.startTime = this.game.time.now

	    this.game.input.keyboard.addCallbacks(this, this.skip, null, null)
	    this.pressed = false
  	}

  	skip() {
	    if (!this.pressed) {
	        this.pressed = true
	        this.state.start('Main')
	    }
	}

	update() {

	    if (this.startTime < this.game.time.now - (this.timeout*1000) && !this.pressed) {
	        this.pressed = true
	        this.state.start('Main')
	    }
	}

}

export default Jam
