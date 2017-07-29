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
        this.allRobots = null
        this.inspector = new Inspector(this.game, 55, 50)
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

		if (this.gameover) {
			return
		}

		this.statusLabel.text = this.step


		if (this.gameStarted) {


		}
	}

	loadRobots(robots) {
		let offset = 0
		for (let robot in robots) {
			console.log(robot)

            if (robots[robot]["y"]%2 == 0) {
                offset = 0
            }
            else {
                offset = 16
            }
        	let newRobot = new Robot(this.game, robots[robot]["frame"], this.map.startX + robots[robot]["x"]*32 + offset, this.map.startY + robots[robot]["y"]*24, this.inspector)
	        console.log("newRobot: " + newRobot.toString())
	   	}		
	}

    openConnection() {
        this.ws = new WebSocket("ws://localhost:8988")//ws://dollarone.games:8988")
        this.connected = false
        this.ws.onmessage = this.onMessage.bind(this)
        this.ws.onerror = this.displayError.bind(this)
        this.ws.onopen = this.connectionOpen.bind(this)
    }

    connectionOpen() {
        this.connected = true
        this.myText.text = 'connected\n'
		this.ws.send(JSON.stringify({action: "setNick", nick: this.playerName}))

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
        	console.log( "received gameStarted with robots: " + msg.robots)
        	
        	this.loadRobots(msg.robots)
            this.gameStarted = true
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
		this.game.debug.text(this.game.time.fps, 420, 20, "#00ff00")
		
	}
}

export default Main