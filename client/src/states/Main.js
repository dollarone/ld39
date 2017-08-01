import Map from 'objects/Map'
import Particle from 'objects/Particle'
import Player from 'objects/Player'
import Robot from 'objects/Robot'
import Inspector from 'objects/Inspector'

class Main extends Phaser.State {

    init(playerName = "Dr. Evil", gameType = "local") {
        this.playerName = playerName
        this.gameType = gameType
    }

	create() {

		this.game.physics.startSystem(Phaser.Physics.ARCADE)

		this.game.stage.backgroundColor = '639bff'//'#5fcde4'//'#98FB98'


        this.splashMusic = this.game.add.audio('splash')
        this.splashMusic.loopFull();


		this.step = -1

		this.statusLabel = this.add.text(this.game.world.width/2 - 360, 10, '')
		this.timeLabel = this.add.text(700, 10, '')
		this.speed = 0

        this.gameover = false

        this.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R)
    	this.rKey.onDown.add(this.restart, this)
    	this.map = new Map(this.game)

        this.openConnection()
        this.myText = this.game.add.text(332, 32, "started (not yet connected)", { font: "14px Arial", fill: "#ff0044"})
        this.game.time.advancedTiming = true
        this.gameStarted = false
        this.myText.visible = false
        
        this.inspector = new Inspector(this.game, 6, 70, this.map)
        this.nextTurnButton = this.game.add.button(6, 30, 'buttons', this.nextTurn, this)//, null, null, 0, 1)
        this.nextTurnButton._onUpFrame = 0
        this.nextTurnButton._onDownFrame = 1

        this.deselectButton = this.game.add.button(80, 30, 'buttons', this.deselect, this)//, null, null, 0, 1)
        this.deselectButton.frame = 2
        this.deselectButton._onUpFrame = 2
        this.deselectButton._onDownFrame = 3

        this.currentPlayerLabel = this.game.add.text(5, 12, "", { font: "14px Arial", fill: "#000000"})
        this.currentPlayer = -1
        this.nextTurnCooldown = 0
        this.turn = null
        this.players = []
        this.firstTurn = true

        this.gameover = false
	}

    deselect() {
        this.inspector.clear()
    }

    nextTurn() {
        //console.log("turn ended by : " + this.game.currentPlayer)
        if (this.nextTurnCooldown==0) {
            this.inspector.clear()
            this.currentPlayer = (this.currentPlayer+1)%2
            this.nextTurnCooldown = 50
            this.currentPlayerLabel.text = "" + this.players[this.currentPlayer] + "'s turn"
            this.game.currentPlayer = this.players[this.currentPlayer]
            //console.log("new turn for : " + this.game.currentPlayer)            
            for(let i=0; i<this.map.robots.length; i++) {
                if(!this.map.robots[i].dead && this.map.robots[i].battery < this.map.robots[i].maxBattery && this.map.robots[i].sprite.frame != 5) {
                    this.map.robots[i].battery += 1
                    
                }
            }
        }

    }

	restart() {
		this.game.state.restart()
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

		if (this.gameStarted && !this.gameover) {
            this.checkWin()
		}
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
            this.result = this.players[1] + " has won this war!"
            this.gameover = true
            this.game.add.text(200, 400, this.result, { font: "24px Arial", fill: "#ff0044"})
        }
        if (!p1HasUnit && !p1HasFactory) {
            this.result = this.players[0] + " has won this war!"
            this.gameover = true
            this.game.add.text(200, 400, this.result, { font: "24px Arial", fill: "#ff0044"})
        }


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
        this.ws = new WebSocket("ws://dollarone.games:8988")
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
        //console.log(msg);
        if (undefined == msg.status) {
        	//do nutjimng
        }
        else if (undefined != msg.status && msg.status == "nickChanged") {
            this.nick = msg.nick
        }
        else if (undefined != msg.status && msg.status == "registered") {
            this.ws.send(JSON.stringify({action: "findGame", gameType: this.gameType}))
        }
        else if (undefined != msg.status && msg.status == "gameStarted") {
        	//console.log( "received gameStarted with robots: " + msg.robots)
        	
            // from server, really:
            this.players[0] = "Big E Corporate"
            this.players[1] = "Blue Sun"

            this.currentPlayer = msg.currentPlayer
            
            this.currentPlayerLabel.text = "" + this.players[this.currentPlayer] + "'s turn"
            this.game.currentPlayer = this.players[this.currentPlayer]

            this.loadRobots(msg.robots)
            this.gameStarted = true
            this.firstTurn = true
            
        }
        else if (undefined != msg.status && msg.status == "exit") {
            this.state.start('Postgame', true, false, msg.player.items)
        }
        else if (undefined != msg.status && msg.status == "miss") {
            this.sfx_swords.play();
        }
        else if (undefined != msg.status && msg.status == "hit") {
            this.play_random_sfx_ugh();
        }
        else if (undefined != msg.status && msg.status == "death") {
            this.sfx_ugh3.play();
        }
        else if (undefined != msg.status && msg.status == "death_by_lava") {
            this.sfx_aaaargh.play();
        }
        else {
            for (var i = 0; i < 10; i++) {
                this.barbarians[i].life = parseInt(msg.players[i].life);
                this.barbarianHearts[i].frame = 3 - parseInt(msg.players[i].life);
                if (parseInt(msg.players[i].life) == 0) {
                    if (msg.players[i].nick == this.nick) {
                        this.gameOver = true;
                        this.gameOverText1.visible = true;
                        this.gameOverText2.visible = true;
                        this.game.camera.follow(null);
                    }
                    this.barbarians[i].x = -100;
                    this.barbarianNames[i].x = -100;
                }
                else {
                    this.barbarians[i].x = parseInt(msg.players[i].x) * 32;
                    this.barbarians[i].y = parseInt(msg.players[i].y) * 32;
                    this.barbarianNames[i].x = parseInt(msg.players[i].x) * 32 + 16;
                    this.barbarianNames[i].y = parseInt(msg.players[i].y) * 32 - 1;
                }
                this.barbarians[i].frame = this.calculateBarbarianFrame(parseInt(msg.players[i].items));

                this.barbarianNames[i].text = msg.players[i].nick;
                this.barbarianNames[i].updateText();

                if (!this.cameraIsSet && msg.players[i].nick == this.nick) {
                    this.game.camera.follow(this.barbarians[i]);
                    this.cameraIsSet = true;

                }
            }
            for (var i = 0; i < 15; i++) {
                this.items[i].x = parseInt(msg.items[i].x) * 32;
                this.items[i].y = parseInt(msg.items[i].y) * 32;
                if (msg.items[i].type == "sword") {
                    this.glintSprite.x = this.items[i].x + 3;
                    this.glintSprite.y = this.items[i].y + 2;
                    if (msg.items[i].owner != "") {
                        for (var j = 0; j < 10; j++) {
                            if (this.barbarianNames[j].text == msg.items[i].owner) {
                                this.glintSprite.x = this.barbarians[j].x + 3;
                                this.glintSprite.y = this.barbarians[j].y + 3;
                                this.glintSprite.bringToTop();
                            }
                        }
                    }
                }
            }
        }
        this.myText.text = 'connected ' + this.nick + '\n' + message.data

    }

    displayError(err) {
        console.log('Websocketerror - probably the server died. Sorry! Error: ' + err)
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
