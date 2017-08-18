class Map {

    constructor(game, level){
        this.game = game
        this.level = level

        let parsedJSON = this.game.cache.getJSON('level' + this.level)
        //console.log(parsedJSON)
        //console.log(parsedJSON.layers[0].data)

        let x = 0
        let y = 0
        this.height = parsedJSON.height
        this.width = parsedJSON.width
        let offset = 0
        this.startX = this.game.width / 2 - this.width*32/2 + 100
        this.startY = this.game.height / 2 - this.height*24/2

        this.map = {}
        this.map["map"] = {}
        //this.map["robots"] = {}
        this.special = null
        this.robots = []

        this.blockerTiles = [0, 3, 7,8,9,10,11, 13,14,15,16,17, 38,39,40,41,42,43,44, 53, 68,69,70,71,72,73,74, 83]

        for (let tile in parsedJSON.layers[0].data) {
            if (parsedJSON.layers[0].data[tile] != 0) {
                let sprite = this.game.add.sprite(this.startX + offset + x*32, this.startY + y*24, 'tiles')
                sprite.frame = parsedJSON.layers[0].data[tile] - 1
                sprite.anchor.setTo(0.5)
                if (sprite.frame == 53 || sprite.frame == 83) {
                    this.special = this.game.add.sprite(this.startX + offset + x*32, this.startY + y*24-32, 'tiles')
                    this.special.frame = sprite.frame - 6
                    this.special.anchor.setTo(0.5)
                }
            }
            if (undefined == this.map["map"][y]) {
                this.map["map"][y] = [this.height]
            }
            if (undefined == this.map["map"][y][x]) {
                this.map["map"][y][x] = [this.width]
            }
            this.map["map"][y][x] = parsedJSON.layers[0].data[tile] - 1

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
        //console.log(" THE MAP" + JSON.stringify(this.map["map"]))
    }

    canMove(x, y) {
        if( x < 0 || x >= this.width || y < 0 || y >= this.height ) {
            return false
        }

        //console.log("looking for " + x + "/" + y)
        //console.log("found " + this.map["map"][y][x])
        let mapTile = this.map["map"][y][x]
        //let robotsTile = this.map["robots"][y][x]
        

        if (mapTile != -1 && this.blockerTiles.indexOf(mapTile) == -1) {
            for(let i=0; i<this.robots.length; i++) {
                if (this.robots[i].dead==false && this.robots[i].mapX == x && this.robots[i].mapY == y
                    && this.robots[i].sprite.frame != 5 && this.robots[i].sprite.frame != 6 && this.robots[i].sprite.frame != 12) {
                    return false
                }
            }
            return true

            //(38-44 inc 53 + 68-74 +83  + 0 + 3  +7-11 + 13-17
        }
        return false
    }

    canTarget(x, y, faction, robotType) {

        if( x < 0 || x >= this.width || y < 0 || y >= this.height ) {
            return false
        }
        let mapTile = this.map["map"][y][x]
        if (mapTile == -1) {
            return false
        }
        if (robotType == 11 || robotType == 17) {
            return true
        }


        if (this.blockerTiles.indexOf(mapTile) == -1) {
            for(let i=0; i<this.robots.length; i++) {
               // console.log("ro" + robotType)
                if (this.robots[i].dead==false && this.robots[i].sprite.frame != 5 && this.robots[i].sprite.frame != 6 && this.robots[i].sprite.frame != 12 
                    && this.robots[i].mapX == x && this.robots[i].mapY == y && (robotType === 11 || robotType === 17 || this.robots[i].faction != faction)) {
                    return true
                }
            }
        }
        return false
    }

// assumes you have checked via canTarget
    getTarget(x, y, faction, robotType) {


        let mapTile = this.map["map"][y][x]

        if (this.blockerTiles.indexOf(mapTile) == -1) {
            for(let i=0; i<this.robots.length; i++) {
               // console.log("ro" + robotType)
                if (this.robots[i].dead==false && this.robots[i].sprite.frame != 5 && this.robots[i].sprite.frame != 6 && this.robots[i].sprite.frame != 12 
                    && this.robots[i].mapX == x && this.robots[i].mapY == y && (robotType === 11 || robotType === 17 || this.robots[i].faction != faction)) {
                    return this.robots[i]
                }
            }
        }
        return null
    }

    update() {
    }

}


export default Map