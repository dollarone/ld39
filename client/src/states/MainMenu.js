class MainMenu extends Phaser.State {

	create() {

		this.game.add.plugin(PhaserInput.Plugin)
		this.myText = this.game.add.text(32, 32, "Your name (will be displayed to other player):", { font: "14px Arial", fill: "#ff0044"})
		this.nameInput = this.game.add.inputField(320, 34)
		this.nameInput.inputEnabled = true
/*		input.startFocus()
		input.focusOutOnEnter = true
		input.lockInput = false
		/*
	    input.events.onInputDown.add(function() {
        	this.game.add.text(200, 100, 'Welcome ' + input.value + '!', {
            	font: '18px Arial', fill: "#ff0044"
        	})
        })
        
/*/

 		this.game.stage.backgroundColor = '#4b0049';

    	this.button = this.game.add.button(this.game.world.centerX - 95, this.game.world.centerY, 'onehourgamejamlogo', this.startButton, this, 2, 1, 0)

	}

	startButton() {	
		this.button.destroy()
		this.nameInput.destroy()
		this.startGame()
	}

	update() {
		this.myText.text = this.nameInput.value
	}


	startGame() {

		this.game.state.start("Main",  true, false, this.nameInput.value)
	}

}

export default MainMenu
