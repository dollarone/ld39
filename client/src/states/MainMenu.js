class MainMenu extends Phaser.State {

	init(colour = "#639bff") {
		this.colour = colour
	}

	create() {
		this.game.stage.backgroundColor = this.colour

		this.game.add.plugin(PhaserInput.Plugin)

		this.sprite = this.game.add.sprite(50, 50, 'title')

		this.startX = 73
		this.startY = 170
		this.inc = 150

		this.mapSelect0 = this.game.add.button(this.startX, this.startY, 'map0', this.select0, this, 0, 0, 0)
		this.mapSelect1 = this.game.add.button(this.startX + this.inc, this.startY, 'map1', this.select1, this, 0, 0, 0)
		this.mapSelect2 = this.game.add.button(this.startX + this.inc*2, this.startY, 'map2', this.select2, this, 0, 0, 0)
		this.mapSelect3 = this.game.add.button(this.startX + this.inc*3, this.startY, 'map3', this.select3, this, 0, 0, 0)
		this.mapSelect0.input.useHandCursor = true
		this.mapSelect1.input.useHandCursor = true
		this.mapSelect2.input.useHandCursor = true
		this.mapSelect3.input.useHandCursor = true

        this.graphics = this.game.add.graphics(0, 0)//this.game.height - 300)
        this.graphics.lineStyle(2, 0x323c39, 1)
        //this.graphics.beginFill(0x4b692f, 1)
        this.graphics.drawRect(this.mapSelect0.x, this.mapSelect0.y-8, 100, 100)
        //this.graphics.endFill()

    	this.button = this.game.add.button(this.game.world.centerX - 35 , this.game.world.centerY+190, 'tiles', this.startButton, this, 2, 1, 0)

    	// defaults
		this.gameType = "local"	
    	this.level = 0

		this.startGameTypeX = 244
    	this.chooseMapLabel = this.game.add.text(this.game.world.centerX - 63, this.game.world.centerY-130, "Choose map", { font: "14px Arial", fill: "#000000"})
    	this.chooseGametypeLabel = this.game.add.text(this.game.world.centerX - 80, this.game.world.centerY+50, "Choose game type", { font: "14px Arial", fill: "#000000"})
    	this.startGameLabel = this.game.add.text(this.game.world.centerX - 56, this.game.world.centerY+168, "Start game", { font: "14px Arial", fill: "#000000"})
        this.hotseatButton = this.game.add.button(this.startGameTypeX, this.game.world.centerY+90, 'buttons', this.chooseHotseat, this)//, null, null, 0, 1)
        this.hotseatButton.frame = 6
        this.hotseatButton._onUpFrame = 6
        this.hotseatButton._onDownFrame = 7
        this.hotseatButton.input.useHandCursor = true
        this.onlineButton = this.game.add.button(this.startGameTypeX + 110, this.game.world.centerY+90, 'buttons', this.chooseOnline, this)//, null, null, 0, 1)
        this.onlineButton.frame = 4
        this.onlineButton._onUpFrame = 4
        this.onlineButton._onDownFrame = 5
        this.onlineButton.input.useHandCursor = true

        this.graphics2 = this.game.add.graphics(0, 0)//this.game.height - 300)
        this.graphics2.lineStyle(2, 0x323c39, 1)
        this.graphics2.drawRect(this.hotseatButton.x-1, this.hotseatButton.y+1, 64, 30)
        

	}

	chooseHotseat() {	
		this.gameType = "local"
		this.graphics2.x = this.hotseatButton.x - this.startGameTypeX 
	}
	chooseOnline() {	
		this.gameType = "online"
		this.graphics2.x = this.onlineButton.x - this.startGameTypeX
	}

	select0() {	
		this.level = 0
		this.levelSelect(this.mapSelect0.x)
	}
	select1() {	
		this.level = 1
		this.levelSelect(this.mapSelect1.x)
	} 
	select2() {	
		this.level = 2
		this.levelSelect(this.mapSelect2.x)
	}
	select3() {	
		this.level = 3
		this.levelSelect(this.mapSelect3.x)
	}
	levelSelect(x) {
		this.graphics.x = x  - this.startX - 1
 
	}
	startButton() {	
		//this.button.destroy()
		this.startGame()
	}

	update() {
	}


	startGame() {

		this.game.state.start("Main",  true, false, this.gameType, this.level)
	}

}

export default MainMenu
