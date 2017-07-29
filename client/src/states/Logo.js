class Logo extends Phaser.State {

	init(colour = "#e99", timeout = 3.5) {
		this.colour = colour
		this.timeout = timeout
	}

	create() {
	    //Change the background colour
	    this.game.stage.backgroundColor = this.colour

	    let logo_top_x = this.game.world.width/2 - 245
	    let logo_top_y = this.game.world.height/2 - 95
	    let tile_space = 17

	    this.platforms = this.game.add.group()

	    this.createTile(logo_top_x+tile_space*4, logo_top_y+tile_space*0, 2)
	    this.createTile(logo_top_x+tile_space*8, logo_top_y+tile_space*0, 2)
	    this.createTile(logo_top_x+tile_space*10, logo_top_y+tile_space*0, 2)

	    this.createTile(logo_top_x+tile_space*2, logo_top_y+tile_space*1, 0)
	    this.createTile(logo_top_x+tile_space*3, logo_top_y+tile_space*1, 1)
	    this.createTile(logo_top_x+tile_space*4, logo_top_y+tile_space*1, 2)
	    this.createTile(logo_top_x+tile_space*5, logo_top_y+tile_space*1, 0)
	    this.createTile(logo_top_x+tile_space*6, logo_top_y+tile_space*1, 1)
	    this.createTile(logo_top_x+tile_space*7, logo_top_y+tile_space*1, 4)
	    this.createTile(logo_top_x+tile_space*8, logo_top_y+tile_space*1, 2)
	    this.createTile(logo_top_x+tile_space*10, logo_top_y+tile_space*1, 2)
	    this.createTile(logo_top_x+tile_space*12, logo_top_y+tile_space*1, 0)
	    this.createTile(logo_top_x+tile_space*13, logo_top_y+tile_space*1, 1)
	    this.createTile(logo_top_x+tile_space*14, logo_top_y+tile_space*1, 2)
	    this.createTile(logo_top_x+tile_space*15, logo_top_y+tile_space*1, 0)
	    this.createTile(logo_top_x+tile_space*16, logo_top_y+tile_space*1, 2)
	    this.createTile(logo_top_x+tile_space*17, logo_top_y+tile_space*1, 0)
	    this.createTile(logo_top_x+tile_space*18, logo_top_y+tile_space*1, 1)
	    this.createTile(logo_top_x+tile_space*19, logo_top_y+tile_space*1, 4)
	    this.createTile(logo_top_x+tile_space*20, logo_top_y+tile_space*1, 1)
	    this.createTile(logo_top_x+tile_space*21, logo_top_y+tile_space*1, 1)
	    this.createTile(logo_top_x+tile_space*22, logo_top_y+tile_space*1, 4)
	    this.createTile(logo_top_x+tile_space*23, logo_top_y+tile_space*1, 0)
	    this.createTile(logo_top_x+tile_space*24, logo_top_y+tile_space*1, 1)
	    this.createTile(logo_top_x+tile_space*25, logo_top_y+tile_space*1, 4)

	    this.createTile(logo_top_x+tile_space*2, logo_top_y+tile_space*2, 2)
	    this.createTile(logo_top_x+tile_space*4, logo_top_y+tile_space*2, 2)
	    this.createTile(logo_top_x+tile_space*5, logo_top_y+tile_space*2, 2)
	    this.createTile(logo_top_x+tile_space*7, logo_top_y+tile_space*2, 2)
	    this.createTile(logo_top_x+tile_space*8, logo_top_y+tile_space*2, 2)
	    this.createTile(logo_top_x+tile_space*10, logo_top_y+tile_space*2, 2)
	    this.createTile(logo_top_x+tile_space*12, logo_top_y+tile_space*2, 2)
	    this.createTile(logo_top_x+tile_space*14, logo_top_y+tile_space*2, 2)
	    this.createTile(logo_top_x+tile_space*15, logo_top_y+tile_space*2, 2)
	    this.createTile(logo_top_x+tile_space*17, logo_top_y+tile_space*2, 2)
	    this.createTile(logo_top_x+tile_space*19, logo_top_y+tile_space*2, 2)
	    this.createTile(logo_top_x+tile_space*20, logo_top_y+tile_space*2, 2)
	    this.createTile(logo_top_x+tile_space*22, logo_top_y+tile_space*2, 2)
	    this.createTile(logo_top_x+tile_space*23, logo_top_y+tile_space*2, 2)
	    this.createTile(logo_top_x+tile_space*25, logo_top_y+tile_space*2, 5)

	    this.createTile(logo_top_x+tile_space*2, logo_top_y+tile_space*3, 3)
	    this.createTile(logo_top_x+tile_space*3, logo_top_y+tile_space*3, 1)
	    this.createTile(logo_top_x+tile_space*4, logo_top_y+tile_space*3, 2)
	    this.createTile(logo_top_x+tile_space*5, logo_top_y+tile_space*3, 3)
	    this.createTile(logo_top_x+tile_space*6, logo_top_y+tile_space*3, 1)
	    this.createTile(logo_top_x+tile_space*7, logo_top_y+tile_space*3, 5)
	    this.createTile(logo_top_x+tile_space*8, logo_top_y+tile_space*3, 3)
	    this.createTile(logo_top_x+tile_space*9, logo_top_y+tile_space*3, 2)
	    this.createTile(logo_top_x+tile_space*10, logo_top_y+tile_space*3, 3)
	    this.createTile(logo_top_x+tile_space*11, logo_top_y+tile_space*3, 2)
	    this.createTile(logo_top_x+tile_space*12, logo_top_y+tile_space*3, 3)
	    this.createTile(logo_top_x+tile_space*13, logo_top_y+tile_space*3, 1)
	    this.createTile(logo_top_x+tile_space*14, logo_top_y+tile_space*3, 2)
	    this.createTile(logo_top_x+tile_space*15, logo_top_y+tile_space*3, 2)
	    this.createTile(logo_top_x+tile_space*17, logo_top_y+tile_space*3, 3)
	    this.createTile(logo_top_x+tile_space*18, logo_top_y+tile_space*3, 1)
	    this.createTile(logo_top_x+tile_space*19, logo_top_y+tile_space*3, 5)
	    this.createTile(logo_top_x+tile_space*20, logo_top_y+tile_space*3, 2)
	    this.createTile(logo_top_x+tile_space*22, logo_top_y+tile_space*3, 2)
	    this.createTile(logo_top_x+tile_space*23, logo_top_y+tile_space*3, 3)
	    this.createTile(logo_top_x+tile_space*24, logo_top_y+tile_space*3, 1)
	    this.createTile(logo_top_x+tile_space*25, logo_top_y+tile_space*3, 2)


	// prod
	    this.createTile(logo_top_x+tile_space*19, logo_top_y+tile_space*4, 6)

	    this.createTile(logo_top_x+tile_space*11, logo_top_y+tile_space*5, 2)
	    this.createTile(logo_top_x+tile_space*17, logo_top_y+tile_space*5, 2)
	    this.createTile(logo_top_x+tile_space*19, logo_top_y+tile_space*5, 7)

	    this.createTile(logo_top_x+tile_space*1, logo_top_y+tile_space*6, 1)
	    this.createTile(logo_top_x+tile_space*2, logo_top_y+tile_space*6, 1)
	    this.createTile(logo_top_x+tile_space*3, logo_top_y+tile_space*6, 4)
	    this.createTile(logo_top_x+tile_space*4, logo_top_y+tile_space*6, 0)
	    this.createTile(logo_top_x+tile_space*5, logo_top_y+tile_space*6, 2)
	    this.createTile(logo_top_x+tile_space*6, logo_top_y+tile_space*6, 0)
	    this.createTile(logo_top_x+tile_space*7, logo_top_y+tile_space*6, 1)
	    this.createTile(logo_top_x+tile_space*8, logo_top_y+tile_space*6, 4)
	    this.createTile(logo_top_x+tile_space*9, logo_top_y+tile_space*6, 0)
	    this.createTile(logo_top_x+tile_space*10, logo_top_y+tile_space*6, 1)
	    this.createTile(logo_top_x+tile_space*11, logo_top_y+tile_space*6, 2)
	    this.createTile(logo_top_x+tile_space*12, logo_top_y+tile_space*6, 2)
	    this.createTile(logo_top_x+tile_space*14, logo_top_y+tile_space*6, 2)
	    this.createTile(logo_top_x+tile_space*15, logo_top_y+tile_space*6, 0)
	    this.createTile(logo_top_x+tile_space*16, logo_top_y+tile_space*6, 2)
	    this.createTile(logo_top_x+tile_space*17, logo_top_y+tile_space*6, 1)
	    this.createTile(logo_top_x+tile_space*18, logo_top_y+tile_space*6, 2)
	    this.createTile(logo_top_x+tile_space*19, logo_top_y+tile_space*6, 2)
	    this.createTile(logo_top_x+tile_space*20, logo_top_y+tile_space*6, 0)
	    this.createTile(logo_top_x+tile_space*21, logo_top_y+tile_space*6, 1)
	    this.createTile(logo_top_x+tile_space*22, logo_top_y+tile_space*6, 4)
	    this.createTile(logo_top_x+tile_space*23, logo_top_y+tile_space*6, 1)
	    this.createTile(logo_top_x+tile_space*24, logo_top_y+tile_space*6, 1)
	    this.createTile(logo_top_x+tile_space*25, logo_top_y+tile_space*6, 4)
	    this.createTile(logo_top_x+tile_space*26, logo_top_y+tile_space*6, 0)
	    this.createTile(logo_top_x+tile_space*27, logo_top_y+tile_space*6, 2)

	    this.createTile(logo_top_x+tile_space*1, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*3, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*4, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*6, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*8, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*9, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*11, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*12, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*14, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*15, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*17, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*19, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*20, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*22, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*23, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*25, logo_top_y+tile_space*7, 2)
	    this.createTile(logo_top_x+tile_space*26, logo_top_y+tile_space*7, 3)
	    this.createTile(logo_top_x+tile_space*27, logo_top_y+tile_space*7, 4)

	    this.createTile(logo_top_x+tile_space*1, logo_top_y+tile_space*8, 1)
	    this.createTile(logo_top_x+tile_space*2, logo_top_y+tile_space*8, 1)
	    this.createTile(logo_top_x+tile_space*3, logo_top_y+tile_space*8, 5)
	    this.createTile(logo_top_x+tile_space*4, logo_top_y+tile_space*8, 2)
	    this.createTile(logo_top_x+tile_space*6, logo_top_y+tile_space*8, 3)
	    this.createTile(logo_top_x+tile_space*7, logo_top_y+tile_space*8, 1)
	    this.createTile(logo_top_x+tile_space*8, logo_top_y+tile_space*8, 5)
	    this.createTile(logo_top_x+tile_space*9, logo_top_y+tile_space*8, 3)
	    this.createTile(logo_top_x+tile_space*10, logo_top_y+tile_space*8, 1)
	    this.createTile(logo_top_x+tile_space*11, logo_top_y+tile_space*8, 2)
	    this.createTile(logo_top_x+tile_space*12, logo_top_y+tile_space*8, 3)
	    this.createTile(logo_top_x+tile_space*13, logo_top_y+tile_space*8, 1)
	    this.createTile(logo_top_x+tile_space*14, logo_top_y+tile_space*8, 5)
	    this.createTile(logo_top_x+tile_space*15, logo_top_y+tile_space*8, 3)
	    this.createTile(logo_top_x+tile_space*16, logo_top_y+tile_space*8, 2)
	    this.createTile(logo_top_x+tile_space*17, logo_top_y+tile_space*8, 3)
	    this.createTile(logo_top_x+tile_space*18, logo_top_y+tile_space*8, 2)
	    this.createTile(logo_top_x+tile_space*19, logo_top_y+tile_space*8, 2)
	    this.createTile(logo_top_x+tile_space*20, logo_top_y+tile_space*8, 3)
	    this.createTile(logo_top_x+tile_space*21, logo_top_y+tile_space*8, 1)
	    this.createTile(logo_top_x+tile_space*22, logo_top_y+tile_space*8, 5)
	    this.createTile(logo_top_x+tile_space*23, logo_top_y+tile_space*8, 2)
	    this.createTile(logo_top_x+tile_space*25, logo_top_y+tile_space*8, 2)
	    this.createTile(logo_top_x+tile_space*26, logo_top_y+tile_space*8, 1)
	    this.createTile(logo_top_x+tile_space*27, logo_top_y+tile_space*8, 5)

	    this.createTile(logo_top_x+tile_space*1, logo_top_y+tile_space*9, 2)

	    this.startTime = this.game.time.now
	  
	    this.game.input.keyboard.addCallbacks(this, this.skip, null, null)
	    this.pressed = false

	    this.theme = this.game.add.audio('dollarone')
	    this.theme.play()
	}

	createTile(x, y, frame) {
    	let ledge = this.platforms.create(x, y, 'logo-tiles')
    	ledge.frame = frame
  	}

  	skip() {
	    if (!this.pressed) {
	        this.pressed = true
	        this.state.start('Jam', true, false, this.colour, this.timeout)
	    }
	}

	update() {

	    if (this.startTime < this.game.time.now - (this.timeout*1000) && !this.pressed) {
	        this.pressed = true
	        this.state.start('Jam', true, false, this.colour, this.timeout)
	    }
	}

}

export default Logo
