import Map from 'objects/Map'
import Particle from 'objects/Particle'
import Player from 'objects/Player'
import Robot from 'objects/Robot'
import Inspector from 'objects/Inspector'

class Main extends Phaser.State {

    init(gameType = "local", level = 0) {
        this.playerName = "Dr Evil"
        this.gameType = gameType
        this.level = level
    }

	create() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE)

		this.game.stage.backgroundColor = '#639bff'//'#5fcde4'//'#98FB98'


        this.splashMusic = this.game.add.audio('splash')
        this.splashMusic.loopFull()

		this.step = -1

		this.statusLabel = this.add.text(this.game.world.width/2 - 360, 10, '')
		this.timeLabel = this.add.text(700, 10, '')
		this.speed = 0

        this.gameover = false

        this.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R)
    	this.rKey.onDown.add(this.restart, this)
    	this.map = new Map(this.game, this.level)

        this.openConnection()
        this.myText = this.game.add.text(332, 32, "started (not yet connected)", { font: "14px Arial", fill: "#ff0044"})
        this.game.time.advancedTiming = true
        this.gameStarted = false
        this.myText.visible = false
        
        this.inspector = new Inspector(this.game, 6, 70, this.map, this.ws)
        this.nextTurnButton = this.game.add.button(6, 25, 'buttons', this.nextTurn, this)//, null, null, 0, 1)
        this.nextTurnButton._onUpFrame = 0
        this.nextTurnButton._onDownFrame = 1
        this.nextTurnButton.input.useHandCursor = true

        this.deselectButton = this.game.add.button(80, 25, 'buttons', this.deselect, this)//, null, null, 0, 1)
        this.deselectButton.frame = 2
        this.deselectButton._onUpFrame = 2
        this.deselectButton._onDownFrame = 3
        this.deselectButton.input.useHandCursor = true

        this.resignButton = this.game.add.button(6, this.game.world.height- 38, 'buttons', this.resign, this)//, null, null, 0, 1)
        this.resignButton.frame = 8
        this.resignButton._onUpFrame = 8
        this.resignButton._onDownFrame = 9
        this.resignButton.input.useHandCursor = true

        this.currentPlayerLabel = this.game.add.text(5, 1, "", { font: "14px Arial", fill: "#000000"})
        this.currentPlayerNumber = -1
        this.nextTurnCooldown = 0
        this.turn = null
        this.players = [2]
        // doesnt matter which order, just used for win condition
        this.players[0] = "Big E Corporate"
        this.players[1] = "Blue Sun"  /// Megahurtz

        this.firstTurn = true

        this.gameover = false

        this.nameLabel = this.game.add.text(155, 1, "You:", { font: "14px Arial", fill: "#000000"})
        this.opponentTextLabel = this.game.add.text(480, 4, "Dr Evil", { font: "11px Monospace", fill: "#000000"})
        this.nameInput = this.game.add.inputField(185, 3, {width:220, max: 30, font: '11px Monospace'})
        this.opponentLabel = this.game.add.text(410, 1, "Opponent:", { font: "14px Arial", fill: "#000000"})
        this.waitingForGameLabel = this.game.add.text(100, 400, "", { font: "24px Arial", fill: "#ff0044"})
        this.yourTurnTextLabel = this.game.add.text(340, 485, "Your turn!", { font: "11px Monospace", fill: "#000000"})
        this.yourTurnTextLabel.alpha = 0

        if (this.gameType == "local") {
            this.nameLabel.visible = false
            this.opponentTextLabel.visible = false
            this.nameInput.visible = false
            this.opponentLabel.visible = false
            this.waitingForGameLabel.visible = false
            this.yourTurnTextLabel.visible = false
        }
   

	}
    resign() {
        this.ws.send(JSON.stringify({action: "resign", nick:this.nameInput.value}))
    }

    deselect() {
        this.inspector.clear()
    }

    nextTurn() {
        console.log("endTurn by : " + this.currentPlayerNumber + " / " + this.playerNumber)
        if (this.nextTurnCooldown==0 && (this.gameType == "local" || this.currentPlayerNumber == this.playerNumber)) { // && (this.gameType == "local" || this.currentPlayer == this.playerFaction)) {
            this.nextTurnCooldown = 50
            this.ws.send(JSON.stringify({action: "endTurn", nick:this.nameInput.value}))
            /*
            this.currentPlayerLabel.text = "" + this.currentPlayer + "'s turn"
            this.game.currentPlayer = this.currentPlayer
            //console.log("new turn for : " + this.game.currentPlayer)            
            for(let i=0; i<this.map.robots.length; i++) {
                if(!this.map.robots[i].dead && this.map.robots[i].battery < this.map.robots[i].maxBattery && this.map.robots[i].sprite.frame != 5) {
                    this.map.robots[i].battery += 1
                    
                }
            }*/
            this.inspector.clear()
        }

    }

	restart() {
        this.splashMusic.stop()
		this.game.state.start("MainMenu")
	}

	endgame() {
		this.gameover = true
	}
	killparticle(part, wall) {
		part.kill()
	}
	update() {
		this.step += 1
        if (this.nextTurnCooldown > 0) {
            this.nextTurnCooldown -= 1
        }
        //this.opponentTextLabel.text = this.nameInput.value
		if (this.gameStarted && !this.gameover) {
        //    this.checkWin()

		}

	}

    yourTurn() {
        let tween = this.game.add.tween(this.yourTurnTextLabel);
        
        tween.to({alpha:1}, 1000, Phaser.Easing.Linear.None);
        tween.onComplete.add(this.fadeOutSlowly, this)
        tween.start()

    }

    fadeOutSlowly() {

        let s = this.game.add.tween(this.yourTurnTextLabel)
        s.to({alpha:0.98}, 1000, Phaser.Easing.Linear.None)
        s.onComplete.add(this.fadeOut, this)
        s.start()

    }

    fadeOut() {

        let s = this.game.add.tween(this.yourTurnTextLabel)
        s.to({alpha:0}, 1000, Phaser.Easing.Linear.None)
        s.start()

    }

    checkWin() {
        /*
        recall: 

this.players[0] = "Big E Corporate"
this.players[1] = "Blue Sun"        
            */
        let p0HasUnit = false
        let p0HasFactory = false        
        let p1HasUnit = false
        let p1HasFactory = false        

        for(let i=0; i<this.map.robots.length; i++) {
            if(!this.map.robots[i].dead) {
                if(this.map.robots[i].sprite.frame == 6 || this.map.robots[i].sprite.frame == 12) {
                    if(this.map.robots[i].faction == this.players[0]) {
                        p0HasFactory = true
                    }
                    else if(this.map.robots[i].faction == this.players[1]) {
                        p1HasFactory = true
                    }
                }
                else {
                    if(this.map.robots[i].faction == this.players[0]) {
                        p0HasUnit = true
                    }
                    else if(this.map.robots[i].faction == this.players[1]) {
                        p1HasUnit = true
                    }
                }
            }
            
        }
        if (!p0HasUnit && !p0HasFactory) {
            this.announceWin(1)
        }
        else if (!p1HasUnit && !p1HasFactory) {
            this.announceWin(0)
        }
    }

    announceWin(pl) {
        this.result = this.players[pl] + " has won this war!"
        this.gameover = true
        this.game.add.text(200, 400, this.result, { font: "24px Arial", fill: "#ff0044"})

    }

	loadRobots(robots) {
		let offset = 0
		for (let robot in robots) {
			//console.log(robot)

            if (robots[robot]["y"]%2 == 0) {
                offset = 0
            }
            else {
                offset = 16
            }
        	let newRobot = new Robot(this.game, robots[robot]["frame"], this.map.startX + robots[robot]["x"]*32 + offset, this.map.startY + robots[robot]["y"]*24, 
                robots[robot]["x"], robots[robot]["y"], this.inspector)

            // give the non-starting player(s) a boost
            if(newRobot.faction != this.game.currentPlayer && (newRobot.sprite.frame == 6 || newRobot.sprite.frame == 12)) {
                newRobot.battery += 1
            }

            this.map.robots.push(newRobot)
	        //console.log("newRobot: " + newRobot.toString())
	   	}
        for(let i=0; i<this.map.robots.length; i++) {
            if (!(this.map.robots[i].sprite.frame == 5 || this.map.robots[i].sprite.frame == 6 || this.map.robots[i].sprite.frame == 12)) {
                this.map.robots[i].sprite.bringToTop()
            }
        }
        if (this.map.special != null) {
            this.map.special.bringToTop()
        }
 
	}

    openConnection() {
        this.ws = new WebSocket("ws://dollarone.games:8988") // ws://localhost:8988") //
        this.connected = false
        this.ws.onmessage = this.onMessage.bind(this)
        this.ws.onerror = this.displayError.bind(this)
        this.ws.onopen = this.connectionOpen.bind(this)
    }

    connectionOpen() {
        this.connected = true
        this.myText.text = 'connected\n'
	//	this.ws.send(JSON.stringify({action: "setNick", nick: this.playerName}))

    }

    onMessage(message) {

        this.queuedAction = ""
        
        var msg = JSON.parse(message.data);
         console.log(msg);
        if (undefined == msg.status) {
        	//do nutjimng
        }
        else if (undefined != msg.status && msg.status == "newTurn") {
            this.currentPlayerNumber = msg.currentPlayer

            this.currentPlayerLabel.text = this.players[this.currentPlayerNumber] + "'s turn"
            if (this.gameType == "local") {
                this.game.currentPlayer = this.players[this.currentPlayerNumber]
            }
            else {
                if (this.currentPlayerNumber == this.playerNumber) {
                    this.yourTurn()
                    this.game.currentPlayer = this.players[this.playerNumber]
                    this.opponentTextLabel.text = msg.opponentNick
                }
                else {
                    this.game.currentPlayer = "Cantseleectanything"
                }
            }
            let tempRobots = msg.robots
            for(let i=0; i<tempRobots.length; i++) {
                this.map.robots[i]["x"] = tempRobots[i]["x"]
                this.map.robots[i]["y"] = tempRobots[i]["y"]
                this.map.robots[i].battery = tempRobots[i]["battery"]
            }

            console.log(" current player " + this.currentPlayerNumber + " robots: " + JSON.stringify(msg.robots))
        }
        else if (undefined != msg.status && msg.status == "registered") {
            this.ws.send(JSON.stringify({action: "findGame", gameType: this.gameType, level: this.level}))
        }
        else if (undefined != msg.status && msg.status == "gameStarted") {
        	//console.log( "received gameStarted with robots: " + msg.robots)
        	
            this.currentPlayerNumber = msg.currentPlayer
            this.playerNumber = msg.playerNumber

            console.log(this.currentPlayer + " and I am " + this.playerNumber)

            if (this.playerNumber == 0) {
                this.nameInput.setText("General Megahurtz of Big E Corp")
                this.opponentTextLabel.text = "President Overload of Blue Sun"
            }
            else {
                this.opponentTextLabel.text = "General Megahurtz of Big E Corp"
                this.nameInput.setText("President Overload of Blue Sun")
            }
            this.currentPlayerLabel.text =  this.players[this.currentPlayerNumber] + "'s turn"

            if (this.gameType == "local") {
                this.game.currentPlayer = this.players[this.currentPlayerNumber]
            }
            else {
                if (this.currentPlayerNumber == this.playerNumber) {
                    this.yourTurn()
                    this.game.currentPlayer = this.players[this.playerNumber]
                }
                else {
                    this.game.currentPlayer = "Cantseleectanything"
                }
            }

            this.loadRobots(msg.robots)
            this.gameStarted = true
            this.firstTurn = true
            this.waitingForGameLabel.text = ""

        }
        else if (undefined != msg.status && msg.status == "waitingForGame") {
            this.waitingForGameLabel.text = "Waiting for game ... you are the first in the queue"
            //this.sfx_swords.play()
            console.log("waitingForGame")
        }
        else if (undefined != msg.status && msg.status == "moveOK") {
            let tempRobots = msg.robots
            for(let i=0; i<tempRobots.length; i++) {
                this.map.robots[i]["x"] = tempRobots[i]["x"]
                this.map.robots[i]["y"] = tempRobots[i]["y"]
                this.map.robots[i]["mapX"] = tempRobots[i]["x"]
                this.map.robots[i]["mapY"] = tempRobots[i]["y"]
                this.map.robots[i]["battery"] = tempRobots[i]["battery"]
                this.map.robots[i].sprite.frame = tempRobots[i]["frame"]
                let offset = 0
                if (this.map.robots[i]["y"]%2 == 0) {
                    offset = 0
                }
                else {
                    offset = 16
                }
                this.map.robots[i].sprite.x = this.map.startX + this.map.robots[i]["x"]*32 + offset
                this.map.robots[i].sprite.y = this.map.startY + this.map.robots[i]["y"]*24
                //this.inspector.inspect(robot)
            }
            console.log(" current player " + this.currentPlayerNumber + " robots: " + JSON.stringify(msg.robots))
        }
        else if (undefined != msg.status && msg.status == "robotBuildOK") {
            let offset = 0
            if (msg.mapY%2 == 0) {
                offset = 0
            }
            else {
                offset = 16
            }

            let newRobot = new Robot(this.game, msg.frame, this.map.startX + msg.mapX*32 + offset, this.map.startY + msg.mapY*24, msg.mapX, msg.mapY, this.inspector)
            this.map.robots.push(newRobot)

            let tempRobots = msg.robots
            for(let i=0; i<tempRobots.length; i++) {
                this.map.robots[i]["battery"] = tempRobots[i]["battery"]
            }
        }
        else if (undefined != msg.status && msg.status == "attackOK") {
            let tempRobots = msg.robots
            for(let i=0; i<tempRobots.length; i++) {
                if (this.map.robots[i]["dead"] == false && tempRobots[i]["dead"] == true) {
                    this.map.robots[i].sprite.kill()
                    this.map.robots[i]["dead"] = tempRobots[i]["dead"]
                }
                this.map.robots[i]["defence"] = tempRobots[i]["defence"]
                this.map.robots[i]["battery"] = tempRobots[i]["battery"]
                
            }
            console.log("[attack] current player " + this.currentPlayerNumber + " robots: " + JSON.stringify(msg.robots))
        }
        else if (undefined != msg.status && msg.status == "gameOver") {
            if (msg.loser == 0) {
                this.announceWin(1)
            }
            else {
                this.announceWin(0)
            }
        }
        else {

        }
        this.myText.text = 'connected ' + this.nick + '\n' + message.data

    }

    displayError(err) {
        console.log('Web Socket error - probably the server died. Sorry! Error: ' + err)
        this.game.add.text(100, 400, "Web Socket error - the server is unreachable or dead. Sorry!\nYour best bet is to reload - or wait a bit and then try again:/", { font: "20px Arial", fill: "#ff0044"})
    }

    sendActionaction() {
        if (action != this.queuedAction) {
            if (this.connected && !this.gameOver) {
                this.ws.send(JSON.stringify({action: action}))
                this.queuedAction = action
            }
        }
    }

	
	render() {
		//this.game.debug.text(this.game.time.fps, 420, 20, "#00ff00")
		
	}
}

export default Main
