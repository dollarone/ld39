import Boot from 'states/Boot'
import Preload from 'states/Preload'
import Main from 'states/Main'
import MainMenu from 'states/MainMenu'
import Logo from 'states/Logo'
import Jam from 'states/Jam'

class Game extends Phaser.Game {

	constructor() {

		//super(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);
		super(700, 500, Phaser.AUTO,  null, false, false);

		this.state.add('Boot', Boot, false)
		this.state.add('Preload', Preload, false)
		this.state.add('Main', Main, false)
		this.state.add('MainMenu', MainMenu, false)
		this.state.add('Logo', Logo, false)
		this.state.add('Jam', Jam, false)

		this.state.start('Boot')
	}

}

new Game()