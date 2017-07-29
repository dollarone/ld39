class Inspector {

    constructor(game, x, y){
        this.game = game
        let top  =70
        this.graphics = this.game.add.graphics(0, 0)//this.game.height - 300)
        this.graphics.lineStyle(2, 0x323c39, 1)
        this.graphics.beginFill(0x4b692f, 1)
        this.graphics.drawRect(0, 0, 150, this.game.height)
        this.graphics.endFill()
        
        this.sprite = this.game.add.sprite(55, top + 50, 'tiles')
        this.sprite.frame = 0
        this.sprite.anchor.setTo(0.5)
        this.sprite.scale.setTo(2, 2)
        this.sprite.visible = false

        this.halo = this.game.add.sprite(0, 0, 'tiles')
        this.halo.frame = 4
        this.halo.anchor.setTo(0.5)
        this.halo.visible = false

        this.name = this.game.add.text(12, top, "", { font: "14px Arial", fill: "#000000"})
        this.description = this.game.add.text(12, top + 80, "", { font: "10px Arial", fill: "#000000"})

    }

    inspect(object) {
        this.halo.visible = false
        this.sprite.frame = object.sprite.frame
        this.sprite.visible = true
        this.name.text = object.name
        this.faction = "Blue Sun"
        this.description.text = "Battery: " + object.battery + " / " + object.maxBattery + "\nMovement cost: " + object.moveCost + "\nAttack cost: " + object.attackCost + 
            "\n\nAttack damage: " + object.attack + "\nDefence: " + object.defence +
            "\nMovement: " + object.movement + "\nFaction: " + object.faction + "\nBuild cost: " + object.cost + " parts" + 
            "\n\nCan " + (object.canClaim ? "" : "NOT ") + "claim factories " +
            "\n\n" + object.description

        this.halo.x = object.sprite.x
        this.halo.y = object.sprite.y
        this.halo.visible = true
    }


}


export default Inspector