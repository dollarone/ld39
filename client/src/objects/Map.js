class Map {

    constructor(game){
        this.game = game

        let parsedJSON = this.game.cache.getJSON('testmap')
        console.log(parsedJSON)
        console.log(parsedJSON.layers[0].data)

        let x = 0
        let y = 0
        this.height = parsedJSON.height
        this.width = parsedJSON.width
        let offset = 0
        this.startX = this.game.width / 2 - this.width*32/2 + 100
        this.startY = this.game.height / 2 - this.height*24/2

        for (let tile in parsedJSON.layers[0].data) {
            if (parsedJSON.layers[0].data[tile] != 0) {
                let sprite = this.game.add.sprite(this.startX + offset + x*32, this.startY + y*24, 'tiles')
                sprite.frame = parsedJSON.layers[0].data[tile] - 1
                sprite.anchor.setTo(0.5)
            }

            x+=1
            if (x%this.width == 0) {
                y+=1
                x=0
                if (y%2 == 0) {
                    offset = 0
                }
                else {
                    offset = 16
                }
            }
            
        }

    //console.log(parsedJSON.layers[0].objects[item]);
    //var type = parsedJSON.layers[0].objects[item].properties.type;
    //var x = parseInt(parsedJSON.layers[0].objects[item].x/32);
    //var y = parseInt(parsedJSON.layers[0].objects[item].y/32);
    //for (item in items) {
    //    if (items[item].type == type) {
    //        items[item].x = x;
    //        items[item].y = y;
    //    }
    //}
    //console.log(tile.toString())


/*
        this.map = this.game.add.tilemap('map2')

        this.map.addTilesetImage('tiles', 'tiles')

        //this.blockedLayer = this.map.createLayer('objectLayer')
        this.blockedLayer = this.map.createLayer('blockedLayer')
        //this.foregroundLayer = this.map.createLayer('foregroundLayer')

        //this.map.setCollisionBetween(1, 10000, true, 'blockedLayer')

        // make the world boundaries fit the ones in the tiled map
        this.blockedLayer.resizeWorld()


        var result = this.findObjectsByType('exit', this.map, 'objectLayer')
        this.exit = this.game.add.sprite(result[0].x, result[0].y, 'tiles')
        this.exit.frame = 8
        this.game.physics.arcade.enable(this.exit)
        this.exit.body.setSize(1, 1, 3, 5)
        this.winnar = false

        var result = this.findObjectsByType('playerStart', this.map, 'objectLayer')
        this.playerStartX =  result[0].x
        this.playerStartY =  result[0].y
        this.player = this.game.add.sprite(result[0].x, result[0].y, 'chars')
        this.player.frame = 1;

*/
    }

    update() {
    }

}


export default Map