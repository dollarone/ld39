class Preload extends Phaser.State {

	preload() {
		/* Preload required assets */
		this.game.load.spritesheet('logo-tiles', 'assets/gfx/logo-tiles.png', 17, 16)
		this.game.load.spritesheet('chars', 'assets/gfx/chars.png', 32, 32)
		this.game.load.spritesheet('tiles', 'assets/gfx/tiles.png', 32, 32)
		this.game.load.audio('dollarone', 'assets/sfx/dollarone.ogg')
		this.game.load.image('onehourgamejamlogo', 'assets/gfx/onehourgamejamlogo.png')
		this.game.load.audio('onehourgamejamsplash', 'assets/sfx/onehourgamejamsplash.ogg')
		//this.game.load.atlas('myAtlas', 'assets/my-atlas.png', 'assets/my-atlas.json')
		//this.game.load.tilemap('map0', 'assets/tilemaps/level.json', null, Phaser.Tilemap.TILED_JSON)
		this.game.load.json('testmap', 'assets/tilemaps/map0.json')
	}

	create() {
		//this.game.state.start("Logo")
		this.game.state.start("MainMenu")
		//this.game.state.start("Logo", true, false, "#98FB98")
	}

}

export default Preload
