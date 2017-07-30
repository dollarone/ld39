class Inspector {

    constructor(game, x, y, map){
        this.game = game
        let top  =70
        this.graphics = this.game.add.graphics(0, 0)//this.game.height - 300)
        this.graphics.lineStyle(2, 0x323c39, 1)
        this.graphics.beginFill(0x4b692f, 1)
        this.graphics.drawRect(0, 0, 150, this.game.height)
        this.graphics.endFill()
        this.map = map
        
        this.sprite = this.game.add.sprite(55, top + 50, 'tiles')
        this.sprite.frame = 0
        this.sprite.anchor.setTo(0.5)
        this.sprite.scale.setTo(2, 2)
        this.sprite.visible = false

        this.halo = this.game.add.sprite(0, 0, 'tiles')
        this.halo.frame = 4
        this.halo.anchor.setTo(0.5)
        this.halo.visible = false

        this.moveHighlights = []
        for(let i=0; i<6; i++) {
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

        this.name = this.game.add.text(12, top, "", { font: "14px Arial", fill: "#000000"})
        this.description = this.game.add.text(12, top + 80, "", { font: "10px Arial", fill: "#000000"})

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
                this.calculateCollateralDamage(destTile)
                attacker.sprite.kill()
                attacker.dead = true
                this.clear()
            }
            else if(attacker.sprite.frame == 11 || attacker.sprite.frame == 17) {
                this.calculateCollateralDamage(destTile)
            }

        }
    }

    calculateCollateralDamage(object) {
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
                    if (this.map.canTarget(object.mapX + x + colOffset  + rowOffset , object.mapY + y)) {
                        let collateral = this.map.getTarget(object.mapX + x + colOffset  + rowOffset , object.mapY + y)
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

        let robot = destTile.robot
        if (robot.battery - robot.moveCost >= 0) {
            robot.mapX = destTile.mapX
            robot.mapY = destTile.mapY
            robot.sprite.x = destTile.x
            robot.sprite.y = destTile.y
            robot.battery -= robot.moveCost

            if(robot.canClaim) {
                for(let i=0; i<this.map.robots.length; i++) {
                   
                    if (!this.map.robots[i].dead && (this.map.robots[i].sprite.frame == 5 || this.map.robots[i].sprite.frame == 6 || this.map.robots[i].sprite.frame == 12)
                        && this.map.robots[i].mapX == robot.mapX && this.map.robots[i].mapY == robot.mapY && this.map.robots[i].faction != robot.faction) {
                        this.map.robots[i].faction = robot.faction
                        if(robot.faction == "Blue Sun") {
                            this.map.robots[i].sprite.frame = 12
                        }
                        else {
                            this.map.robots[i].sprite.frame = 6
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
        this.description.text = "Battery: " + object.battery + " / " + object.maxBattery + "\nMovement cost: " + object.moveCost + "\nAttack cost: " + object.attackCost + 
            "\n\nAttack range: " + object.range + "\nAttack damage: " + object.attack + "\nDamage limit: " + object.defence +
            "\nFaction: " + object.faction + "\nBuild cost: " + object.cost + 
            "\n\n" + (object.canClaim ? "Can claim factories" : "") + 
            "\n\nWeapon: " + object.weapon + "\n\n" + object.description

        this.halo.x = object.sprite.x
        this.halo.y = object.sprite.y
        this.halo.visible = true

        if (true) { 
            let moveHighlightNo = 0
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
                || object.faction == this.game.currentPlayer || object.battery == 0) {
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
            while(moveHighlightNo<6) {
                this.moveHighlights[moveHighlightNo].visible = false
                moveHighlightNo+=1
            }

            let targetNo = 0
            minX = -object.range
            minY = -object.range
            maxX = object.range
            maxY = object.range
            if(this.sprite.frame == 5 || this.sprite.frame == 6 || this.sprite.frame == 12 
                || object.faction == this.game.currentPlayer || object.battery == 0) {
                maxX=minX
                maxY=minY
            }

            for (let x=minX; x<=maxX; x++) {
                for (let y=minY; y<=maxY; y++) {
                    if(x==0 && y==0 || x==maxX && y==minY || x==maxX && y==maxY || x==maxX && y!=0) {
                        // do nothing
                    } else if (false && colOffset == 1 && (y==minY || y==maxY) && x==maxX-1 && (y>maxY-1 || y<minY+1)) {
                        // what is this
                    }
                    else if (false && colOffset == 0 && (y==minY || y==maxY) && x==minX && (y>maxY-1 || y<minY+1)) {
                    }
                    // hardcoding this failing algo
                    else if ((object.range == 3 && x==-3 && y==-3 && colOffset == 1) 
                        || (object.range == 3 && x==-3 && y==-2 && colOffset == 0) 
                        || (object.range == 3 && x==2 && y==-2 && colOffset == 1) 
                        || (object.range == 3 && x==2 && y==-3 && colOffset == 0)
                        || (object.range == 3 && x==2 && y==3 && colOffset == 0)
                        || (object.range == 3 && x==2 && y==2 && colOffset == 1) 
                        || (object.range == 3 && x==-3 && y==3 && colOffset == 1) 
                        || (object.range == 3 && x==-3 && y==2 && colOffset == 0) 
                        ) {

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
        while(moveHighlightNo<6) {
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