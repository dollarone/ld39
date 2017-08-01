import Robot from 'objects/Robot'

class Inspector {

    constructor(game, x, top, map){
        this.game = game
        this.graphics = this.game.add.graphics(0, 0)//this.game.height - 300)
        this.graphics.lineStyle(2, 0x323c39, 1)
        this.graphics.beginFill(0x4b692f, 1)
        this.graphics.drawRect(0, 0, 150, this.game.height)
        this.graphics.endFill()
        this.map = map
        
        this.sprite = this.game.add.sprite(x+28, top + 50, 'tiles')
        this.sprite.frame = 0
        this.sprite.anchor.setTo(0.5)
        this.sprite.scale.setTo(2, 2)
        this.sprite.visible = false

        this.halo = this.game.add.sprite(0, 0, 'tiles')
        this.halo.frame = 4
        this.halo.anchor.setTo(0.5)
        this.halo.visible = false

        this.moveHighlights = []
        for(let i=0; i<12; i++) {
            let moveHighlight = this.game.add.sprite(0, 0, 'tiles')
            moveHighlight.frame = 18
            moveHighlight.anchor.setTo(0.5)
            moveHighlight.visible = false
            moveHighlight.inputEnabled = true
            moveHighlight.events.onInputDown.add(this.move, this)

            this.moveHighlights.push(moveHighlight)
        }
        this.targets = []
        for(let i=0; i<55; i++) {
            let target = this.game.add.sprite(0, 0, 'tiles')
            target.frame = 19
            target.anchor.setTo(0.5)
            target.visible = false
            target.inputEnabled = true
            target.events.onInputDown.add(this.attack, this)

            this.targets.push(target)
        }

        this.builds = {}

        let buildX = 70
        let buildY = 230
        for(let i=7; i<18; i++) {
            if (i==12) {
                buildY = 230
            }
            else {
                this.builds[i] = this.game.add.sprite(buildX, buildY, 'tiles')
                this.builds[i].frame = i
                this.builds[i].anchor.setTo(0.5)
                this.builds[i].visible = false
                this.builds[i].inputEnabled = true
                this.builds[i].events.onInputDown.add(this.build, this)
                buildY+=40
            }
        } 


        this.name = this.game.add.text(x, top, "", { font: "14px Arial", fill: "#000000"})
        this.description = this.game.add.text(x, top + 80, "", { font: "10px Arial", fill: "#000000"})

    }

    build(destTile) {

        let cost = 1
        if (destTile.frame == 9 || destTile.frame == 10 || destTile.frame == 15 || destTile.frame == 16) {
            cost = 3
        }
        else if (destTile.frame == 11 || destTile.frame == 17) {
            cost = 4
        }
        //console.log("build " + destTile.frame + " (cost " + cost  + ") at " + this.mapX + "," + this.mapY)

        if(this.selectedFactory.battery - cost < 0) {
          //  console.log("too expensive mate")
            return
        }
        this.selectedFactory.battery -= cost

        let offset = 0
        if (this.mapY%2 == 0) {
            offset = 0
        }
        else {
            offset = 16
        }
        let newRobot = new Robot(this.game, destTile.frame, this.map.startX + this.mapX*32 + offset, this.map.startY + this.mapY*24, 
            this.mapX, this.mapY, this)
        this.map.robots.push(newRobot)
        this.inspect(this.selectedFactory)

    }

    attack(destTile) {

// could be a tile with robot or an empty tile (bombs)
        let target = destTile.target
        let attacker = destTile.attacker
        if (attacker.battery - attacker.attackCost >= 0) {
            attacker.battery -= attacker.attackCost 
            if (target!=null) {
                target.defence -= attacker.attack
                if (target.defence < 1) {
                    target.sprite.kill()
                    target.dead = true
                }
            }
            this.inspect(attacker)

            if(attacker.sprite.frame == 7 || attacker.sprite.frame == 13) {
                this.calculateCollateralDamage(destTile, destTile.attacker.mapX, destTile.attacker.mapY)
                this.inspect(attacker)
                attacker.sprite.kill()
                attacker.dead = true
                this.clear()
            }
            else if(attacker.sprite.frame == 11 || attacker.sprite.frame == 17) {
                this.calculateCollateralDamage(destTile, destTile.mapX, destTile.mapY)
                
            }

        }
    }

    calculateCollateralDamage(object, fromX, fromY) {
        let colOffset = 1
        if (object.mapY%2==0) {
            colOffset = 0
        }
        let rowOffset = 0
        let minX = -1
        let minY = -1
        let maxX = 1
        let maxY = 1

        for (let x=minX; x<=maxX; x++) {
            for (let y=minY; y<=maxY; y++) {
                if(x==0 && y==0 || x==maxX && y==minY || x==maxX && y==maxY || x==maxX && y!=0) {
                }
                else {
                    if (object.mapY%2==0) {
                        rowOffset = 0
                    }
                    else if(y==0) {
                        rowOffset = -1
                    }
                    else {
                        rowOffset = 0
                    }
                    //oops forgot it checks faction. HACK: "foo"
                    if (this.map.canTarget(fromX + x + colOffset  + rowOffset , fromY + y, "foo", object.attacker.sprite.frame)) {
                        let collateral = this.map.getTarget(fromX + x + colOffset  + rowOffset , fromY + y, "foo", object.attacker.sprite.frame)
                        if (collateral != null) {
                            collateral.defence -= object.attacker.attack
                            if (collateral.defence < 1) {
                                collateral.sprite.kill()
                                collateral.dead = true
                            }

                        }
                    }
                }
            }
        }            

    }

    move(destTile) {
//        console.log("str: " + str.x + "/" + str.y )
 //       console.log("str: " + str.robot.description)
//console.log("move")
        let robot = destTile.robot
        if (robot.battery - robot.moveCost >= 0) {
            for(let i=0; i<this.map.robots.length; i++) {
                if (robot === this.map.robots[i]) {
                    //console.log("happy")
                    this.map.robots[i].mapX = destTile.mapX
                    this.map.robots[i].mapY = destTile.mapY
                    this.map.robots[i].sprite.x = destTile.x
                    this.map.robots[i].sprite.y = destTile.y
                    this.map.robots[i].battery -= robot.moveCost

                }
            }


            if(robot.canClaim) {
                for(let i=0; i<this.map.robots.length; i++) {
                   
                    if (!this.map.robots[i].dead && (this.map.robots[i].sprite.frame == 5 || this.map.robots[i].sprite.frame == 6 || this.map.robots[i].sprite.frame == 12)
                        && this.map.robots[i].mapX == robot.mapX && this.map.robots[i].mapY == robot.mapY && this.map.robots[i].faction != robot.faction) {
                        this.map.robots[i].faction = robot.faction
                        if(robot.faction == "Blue Sun") {
                            this.map.robots[i].sprite.frame = 6
                        }
                        else {
                            this.map.robots[i].sprite.frame = 12
                        }
                    }
                }
            }

            this.inspect(robot)

        }

    }
    update(object) {
     

    }

    inspect(object) {
        this.halo.visible = false
        this.sprite.frame = object.sprite.frame
        this.sprite.visible = true
        this.name.text = object.name
//        this.faction = "Blue Sun"
        let moveHighlightNo = 0
        if((object.sprite.frame == 5 || object.sprite.frame == 6 || object.sprite.frame == 12) && object.faction != this.game.currentPlayer) {
            this.description.text = "Battery: " + object.battery + " / " + object.maxBattery + "\nFaction: " + object.faction
            for (let i=7; i<18; i++) {
                if (i!=12) {
                    this.builds[i].visible = false
                }
            }
        }
        else if((object.sprite.frame == 6 || object.sprite.frame == 12) && object.faction == this.game.currentPlayer) {
            this.description.text = "Battery: " + object.battery + " / " + object.maxBattery + "\nFaction: " + object.faction + "\n\nBuild cost:\n" +
                "             1:\n\n             1:\n\n             3:\n\n             3:\n\n             4:\n" + 
                "\nClick to buy (can not build if\nfactory tile is occupied)"
            this.selectedFactory = object
            for (let i=7; i<18; i++) {
                if (i != 12) {                
                    this.moveHighlights[moveHighlightNo].x = this.builds[i].x
                    this.moveHighlights[moveHighlightNo].y = this.builds[i].y
                    this.moveHighlights[moveHighlightNo].visible = true
                    moveHighlightNo+= 1
                    this.mapX = object.mapX
                    this.mapY = object.mapY
                    this.buildFrame = i
                    this.builds[i].bringToTop()
                }

                if (i < 12) {
                    if (this.game.currentPlayer == "Blue Sun") {
                        this.builds[i].visible = true
                    }
                    else {
                        this.builds[i].visible = false
                    }
                }
                if (i > 12) {
                    if (this.game.currentPlayer != "Blue Sun") {
                        this.builds[i].visible = true
                    }
                    else {
                        this.builds[i].visible = false
                    }
                }
            }
            
        }
        else {
            this.description.text = "Battery: " + object.battery + " / " + object.maxBattery + "\nBody integrity: " + object.defence + " / " + object.maxDefence +
            "\nMovement cost: " + object.moveCost + "\nAttack cost: " + object.attackCost + 
            "\nAttack range: " + (object.range == 3? object.specialRange : object.range) + "\nAttack damage: " + object.attack + 
            "\nBuild cost: " + object.cost + "\nFaction: " + object.faction + 
            "\n\n" + (object.canClaim ? "Can claim factories" : "") + 
            "\n\nWeapon: " + object.weapon + "\n\n" + object.description
            for (let i=7; i<18; i++) {
                if (i!=12) {
                    this.builds[i].visible = false
                }
            }
    
        }

        this.halo.x = object.sprite.x
        this.halo.y = object.sprite.y
        this.halo.visible = true

        if (true) { 
            
            let offset = 0
            let colOffset = 1
            if (object.mapY%2==0) {
                colOffset = 0
            }
            let rowOffset = 0


// turns out movement > 1 is a bitch as I needto add proper pathfinding. FIX is set all to 1, lower costs, use the orig code for range calc :)
            let minX = -1
            let minY = -1
            let maxX = 1
            let maxY = 1
            if(this.sprite.frame == 5 || this.sprite.frame == 6 || this.sprite.frame == 12 
                || object.faction != this.game.currentPlayer || object.battery == 0) {
                maxX=minX
                maxY=minY
            }

            for (let x=minX; x<=maxX; x++) {
                for (let y=minY; y<=maxY; y++) {
                    if(x==0 && y==0 || x==maxX && y==minY || x==maxX && y==maxY || x==maxX && y!=0) {
                    }
                    else {
                        if (object.mapY%2==0) {
                            rowOffset = 0
                        }
                        else if(y==0) {
                            rowOffset = -1
                        }
                        else {
                            rowOffset = 0
                        }

                        if (this.map.canMove(object.mapX + x + colOffset  + rowOffset , object.mapY + y)) {
                            //console.log(object.mapX + "/" + object.mapY + " and x/y : " + x + "/" + y + " and minX/Y : " + minX  + "/" + minY + " and maxX/Y : " + maxX + "/" + maxY + " colOffset : " + colOffset)
                            if ((object.mapY+y)%2==0) {
                                offset = 0
                            }
                            else {
                                offset = 16
                            }
                            this.moveHighlights[moveHighlightNo].x = this.map.startX + offset + ((object.mapX + x + colOffset  + rowOffset) *32)
                            this.moveHighlights[moveHighlightNo].y = this.map.startY + (object.mapY + y) *24
                            this.moveHighlights[moveHighlightNo].visible = true
                            this.moveHighlights[moveHighlightNo].robot = object
                            this.moveHighlights[moveHighlightNo].mapX = object.mapX + x + colOffset  + rowOffset
                            this.moveHighlights[moveHighlightNo].mapY = object.mapY + y
                            this.moveHighlights[moveHighlightNo].bringToTop()
                            moveHighlightNo+=1
                        }
                    }
                }
            }            
            while(moveHighlightNo<12) {
                this.moveHighlights[moveHighlightNo].visible = false
                moveHighlightNo+=1
            }

            let targetNo = 0
            minX = -object.range
            minY = -object.range
            maxX = object.range
            maxY = object.range
            if(this.sprite.frame == 5 || this.sprite.frame == 6 || this.sprite.frame == 12 
                || object.faction != this.game.currentPlayer || object.battery == 0) {
                maxX=minX
                maxY=minY
            }

            for (let x=minX; x<=maxX; x++) {
                for (let y=minY; y<=maxY; y++) {
                    if (object.mapY%2==0) {
                        rowOffset = 0
                    }
                    else if(y==0) {
                        rowOffset = -1
                    }
                    else {
                        rowOffset = 0
                    }
                    if(x==0 && y==0 || x==maxX && y==minY || x==maxX && y==maxY || x==maxX && y!=0) {
                        // do nothing
                    } 
                    else if (object.range == 3 && colOffset == 1 && (y==minY || y==maxY) && x==maxX-1 && (y>maxY-1 || y<minY+1)) {
                        // what is this
                    }
                    else if (object.range == 3 && colOffset == 0 && (y==minY || y==maxY) && x==minX && (y>maxY-1 || y<minY+1)) {
                    }
                    // hardcoding this failing algo
                    else if (object.range == 3 && ((x==-3 && y==-3 && colOffset == 1) 
                        || (x==-3 && y==-2 && colOffset == 0) 
                        || (x==2 && y==-2 && colOffset == 1) 
                        || (x==2 && y==-3 && colOffset == 0)
                        || (x==2 && y==3 && colOffset == 0)
                        || (x==2 && y==2 && colOffset == 1) 
                        || (x==-3 && y==3 && colOffset == 1) 
                        || (x==-3 && y==2 && colOffset == 0))) {

                    }
                    else if((object.sprite.frame == 11 || object.sprite.frame == 17) &&
                         ( (x==0 && y==1) 
                        || (x==0 && y==-1) 
                        || (x==1 && y==0) 
                        || (x==-1 && y==1) 
                        || (x==-1 && y==-1) 
                        || (x==-1 && y==0) )) {
                    }

                    else {
 
                        if (this.map.canTarget(object.mapX + x + colOffset  + rowOffset , object.mapY + y, object.faction, object.sprite.frame)) {
                            //console.log(object.mapX + "/" + object.mapY + " and x/y : " + x + "/" + y + " and minX/Y : " + minX  + "/" + minY + " and maxX/Y : " + maxX + "/" + maxY + " colOffset : " + colOffset)
                            if ((object.mapY+y)%2==0) {
                                offset = 0
                            }
                            else {
                                offset = 16
                            }

                            // find target


                            this.targets[targetNo].x = this.map.startX + offset + ((object.mapX + x + colOffset  + rowOffset) *32)
                            this.targets[targetNo].y = this.map.startY + (object.mapY + y) *24
                            this.targets[targetNo].target = this.map.getTarget(object.mapX + x + colOffset  + rowOffset , object.mapY + y, object.faction, object.sprite.frame)
                            this.targets[targetNo].attacker = object
                            this.targets[targetNo].mapX = object.mapX + x + colOffset  + rowOffset
                            this.targets[targetNo].mapY = object.mapY + y
                            this.targets[targetNo].bringToTop()
                            this.targets[targetNo].visible = true
                            targetNo+=1
                        }
                    }
                }

            }
            while(targetNo<55) {
                this.targets[targetNo].visible = false
                targetNo+=1
            }
            
        }
    }

    clear() {
        this.halo.visible = false
        let moveHighlightNo = 0
        while(moveHighlightNo<12) {
            this.moveHighlights[moveHighlightNo].visible = false
            moveHighlightNo+=1
        }

        let targetNo = 0
        while(targetNo<55) {
            this.targets[targetNo].visible = false
            targetNo+=1
        }

    }


}


export default Inspector
