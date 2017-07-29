class Boot extends Phaser.State {

	preload() {

	}

	create() {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL//NO_SCALE
		this.game.state.start("Preload")
		
		this.scale.pageAlignHorizontally = true
		this.scale.pageAlignVertically = true

		this.game.stage.smoothed = false
		this.game.smoothed = false
		this.game.antialias = false
		//physics system
		//PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST //for WebGL
		//Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)

	}

}

export default Boot