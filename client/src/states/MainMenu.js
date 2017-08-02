class MainMenu extends Phaser.State {

	init(colour = "#aaa") {
		this.colour = colour
	}

	create() {
		this.game.stage.backgroundColor = this.colour

		this.game.add.plugin(PhaserInput.Plugin)

		this.sprite = this.game.add.sprite(50, 50, 'title')

		this.startX = 73
		this.startY = 230
		this.inc = 150

		this.mapSelect0 = this.game.add.button(this.startX, this.startY, 'map0', this.select0, this, 0, 0, 0)
		this.mapSelect1 = this.game.add.button(this.startX + this.inc, this.startY, 'map1', this.select1, this, 0, 0, 0)
		this.mapSelect2 = this.game.add.button(this.startX + this.inc*2, this.startY, 'map2', this.select2, this, 0, 0, 0)
		this.mapSelect3 = this.game.add.button(this.startX + this.inc*3, this.startY, 'map3', this.select3, this, 0, 0, 0)
		
        this.graphics = this.game.add.graphics(0, 0)//this.game.height - 300)
        this.graphics.lineStyle(2, 0x323c39, 1)
        //this.graphics.beginFill(0x4b692f, 1)
        this.graphics.drawRect(this.mapSelect0.x, this.mapSelect0.y-8, 100, 100)
        //this.graphics.endFill()

    	this.button = this.game.add.button(this.game.world.centerX - 95, this.game.world.centerY+200, 'tiles', this.startButton, this, 2, 1, 0)

		this.gameType = "local"
    	this.level = 0

    	this.chooseMapLabel = this.game.add.text(this.game.world.centerX - 63, this.game.world.centerY-70, "Choose map", { font: "14px Arial", fill: "#000000"})
    	this.startGameLabel = this.game.add.text(this.game.world.centerX - 56, this.game.world.centerY+208, "Start game", { font: "14px Arial", fill: "#000000"})
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
