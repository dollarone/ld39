class Preload extends Phaser.State {

	preload() {
		/* Preload required assets */
		this.game.load.spritesheet('logo-tiles', 'assets/gfx/logo-tiles.png', 17, 16)
		this.game.load.spritesheet('chars', 'assets/gfx/chars.png', 32, 32)
		this.game.load.spritesheet('tiles', 'assets/gfx/tiles.png', 32, 32)
		this.game.load.spritesheet('buttons', 'assets/gfx/buttons.png', 64, 32)
		this.game.load.audio('dollarone', 'assets/sfx/dollarone.ogg')
		this.game.load.audio('splash', 'assets/sfx/ld39.ogg')
		//this.game.load.atlas('myAtlas', 'assets/my-atlas.png', 'assets/my-atlas.json')
		//this.game.load.tilemap('map0', 'assets/tilemaps/level.json', null, Phaser.Tilemap.TILED_JSON)
		this.game.load.json('level0', 'assets/tilemaps/map0.json')
		this.game.load.json('level1', 'assets/tilemaps/map1.json')
		this.game.load.json('level2', 'assets/tilemaps/map2.json')
		this.game.load.json('level3', 'assets/tilemaps/map3.json')
		this.game.load.image('map0', 'assets/gfx/map0.png')
		this.game.load.image('map1', 'assets/gfx/map1.png')
		this.game.load.image('map2', 'assets/gfx/map2.png')
		this.game.load.image('map3', 'assets/gfx/map3.png')
		this.game.load.image('title', 'assets/gfx/titlescreen.png')
	}

	create() {
		//this.game.state.start("Logo")
	//	this.game.state.start("MainMenu")
		this.game.state.start("Logo", true, false, "#639bff")
	}

}

export default Preload
