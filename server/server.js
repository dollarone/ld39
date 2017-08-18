let WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8988})

console.log('Server started on 8988')


let players = []
currentPlayer = 0

let start_x = 4
let start_y = 2

let next_player_id = 0

let factions = [2]
factions[0] = "Big E Corporate"
factions[1] = "Blue Sun"

blockerTiles = [0, 3, 7,8,9,10,11, 13,14,15,16,17, 38,39,40,41,42,43,44, 53, 68,69,70,71,72,73,74, 83]


let map = []

for(let i=0; i<4; i++) {
    let parsedJSON = require('../client/static/assets/tilemaps/map' + i + '.json')

    let height = parsedJSON.height
    let width = parsedJSON.width


    map[i] = {}
    map[i]["map"] = []
    map[i]["robots"] = []

    console.log(parsedJSON)
    let x = 0
    let y = 0
    for (let tile in parsedJSON.layers[0].data) {
        //console.log("tile:" + tile)
        //if (parsedJSON.layers[0].data[tile] >= 0) {
            //let sprite = this.game.add.sprite(startX + offset + x*32, startY + y*24, 'tiles')
            //sprite.frame = parsedJSON.layers[0].data[tile] - 1
            if (undefined == map[i]["map"][y]) {
                map[i]["map"][y] = [height]
            }
            if (undefined == map[i]["map"][y][x]) {
                map[i]["map"][y][x] = [width]
            }
            map[i]["map"][y][x] = parsedJSON.layers[0].data[tile] - 1
            //console.log("hey: " + x + "," + y + " : " + map[0]["map"][y][x])
        //}

        x+=1
        if (x%width == 0) {
            y+=1
            x=0
        }
        
    }

    let buffer = ""
    for (let y=0; y<height; y++) {
        for (let x=0; x<width; x++) {
            if (map[i]["map"][y][x].toString().length < 2) {
                buffer += " "
            }
            buffer += map[i]["map"][y][x] + ", "
        }
        buffer += "\n"
    }
    console.log("loaded map:" + i + "\n" + buffer)


    x = 0
    y = 0
    for (let tile in parsedJSON.layers[1].data) {
    //        if (undefined == map[0]["robots"][y]) {
    //            map[0]["robots"][y] = [height]
    //        }
    //        if (undefined == map[0]["robots"][y][x]) {
    //            map[0]["robots"][y][x] = [width]
    //        }
        let batt = 6
        let canClaim = false
        let frame = parsedJSON.layers[1].data[tile] - 1
        let attackCost = 4
        let attack = 0
        let defence = 0
        let faction = "Neutral"
        if (frame >= 12) {
            faction = factions[1]
        }
        else {
             faction = factions[0]
        }

        if (frame == 7 || frame == 13) {
            batt = 4
            attackCost = 0
            attack = 2
            defence = 1
        }
        else if (frame == 8 || frame == 14) {
            batt = 3
            canClaim = true
            attackCost = 1
            attack = 1
            defence = 1
        }
        else if (frame == 9 || frame == 15) {
            batt = 7
            attackCost = 4
            defence = 1
            attack = 5
            defence = 8
        }
        else if (frame == 10 || frame == 16) {
            batt = 7
            canClaim = true
            attackCost = 1
            attack = 2
            defence = 5
        }
        else if (frame == 11 || frame == 17) {
            batt = 6
            attackCost = 3
            attack = 2
            defence = 5
        }
        let maxBatt = batt
        if (frame == 6 || frame == 12) {
            batt = 1
            attackCost = 0
            maxBatt = 10
        }
        else if (frame == 5) {
            batt = 0
            attackCost = 0
            faction = "Neutral"
            maxBatt = 5
        }

        

        if (parsedJSON.layers[1].data[tile] > 0) {
           map[i]["robots"].push( {y:y, x:x, frame:frame, battery:batt, maxBattery:maxBatt, moveCost:1, canClaim:canClaim, dead:false, attackCost:attackCost, attack:attack, defence:defence, faction:faction} )
        }

        x+=1
        if (x%width == 0) {
            y+=1
            x=0
        }

            //console.log("hey: " + x + "," + y + " : " + map[0]["map"][y][x])

    }
}

let turn = 0

let staticUsers = {}
let games = {}
let staticGameNumber = -1
let earliestOnGoingGame = 0

let waiting = {}
for (let y=0; y<4; y++) {
    waiting[y] = {}
    waiting[y]["user"] = null
    waiting[y]["ws"] = null
}

wss.on('connection', function(ws) {
console.log(ws)
    console.log('connected: ' + ws.upgradeReq.headers['sec-websocket-key'])
    var user = ws.upgradeReq.headers['sec-websocket-key']
//    console.log('connected: ' + ws.upgradeReq.headers['sec-websocket-key']);
    if (user in staticUsers) {
        console.log("user already registered?")
    }
    else {
        staticUsers[user] = {}

        let payload = new Object()
        payload["status"] = "registered"
        console.log("registration: #" + " (" + user + ")")
        ws.send(JSON.stringify(payload))
    }

    let usersGameNumber = 0

    ws.on('message', function(message) {       
        let incomingMsg = JSON.parse(message)

        if (usersGameNumber == -1) {
            usersGameNumber = ws.gameNumber
            console.log("it worked! setting " + usersGameNumber + " to " + ws.gameNumber)
        }
        if (user in staticUsers) {
            
            //players[users[user]].action = incomingMsg.action;
            //console.log("action from #" + users[user] + " " + players[users[user]].nick + ": " + incomingMsg.action);
            console.log("action from #" + user + " (current nick: " + staticUsers[user].nick + ") " + ": " + incomingMsg.action + " [" + incomingMsg.gameType + "]")
            for ( a in incomingMsg) { console.log(a + ": " + incomingMsg[a])}

            if (incomingMsg.action == "setNick") {
                if (incomingMsg.nick == null || incomingMsg.nick == undefined || incomingMsg.nick == "" || incomingMsg["nick"] == undefined) {
                    if (staticUsers[user] != undefined && (staticUsers[user].nick == null || staticUsers[user].nick == undefined || staticUsers[user].nick == "" || staticUsers[user]["nick"] == undefined)) {
                        staticUsers[user].nick = "Dr. Rust"
                    }
                }
                else {
                    staticUsers[user].nick = incomingMsg.nick
                }

                console.log(user + " setNick to : " + staticUsers[user].nick)

                let payload = new Object();
                payload["status"] = "nickChanged";
                payload["nick"] = staticUsers[user].nick
                ws.send(JSON.stringify(payload));
            }
            else if (incomingMsg.action == "findGame") {
                if (incomingMsg.gameType == "online") {
                    if (waiting[incomingMsg.level]["user"] == null) {
                        //wait
                        waiting[incomingMsg.level]["user"] = user
                        waiting[incomingMsg.level]["ws"] = ws

                        usersGameNumber = -1

                        let payload = new Object()
                        payload["status"] = "waitingForGame"
                        console.log("waiting for game: " + user + " on level " + incomingMsg.level)
                        ws.send(JSON.stringify(payload))
                    }
                    else {
                        let usersInGame = [2]
                        usersInGame[0] = waiting[incomingMsg.level]["user"]
                        usersInGame[1] = user
                        waiting[incomingMsg.level]["user"] = null
                        let usersWs = [2]
                        usersWs[0] = waiting[incomingMsg.level]["ws"]
                        usersWs[1] = ws

                        waiting[incomingMsg.level]["ws"] = null
                        usersGameNumber = startNewGame(usersWs, usersInGame, incomingMsg.gameType, incomingMsg.level)
                        usersWs[0].gameNumber = usersGameNumber
                    }
                }
                // if another findGame, join and send Start
                // type: local = just start immediately, assume client will send both p1 and p2 (>2?)
                // ,ai,
                // ,online
                // also provide map (or random)
                else if (incomingMsg.gameType == "local") {
                    let usersInGame = [2]
                    usersInGame[0] = user
                    usersInGame[1] = user
                    let usersWs = [2]
                    usersWs[0] = ws
                    usersWs[1] = ws
                    usersGameNumber = startNewGame(usersWs, usersInGame, incomingMsg.gameType, incomingMsg.level)
                }

            }
            else if (incomingMsg.action == "endTurn") {
                for(let i=0; i<games[usersGameNumber]["playerCount"]; i++) {
                    let userString = games[usersGameNumber]["players"][i]["user"]
                    if (userString == user && games[usersGameNumber]["currentPlayer"] == i) {
                        console.log(user + " ending turn in game " + usersGameNumber)
                        endTurn(incomingMsg, usersGameNumber)
                        break // because local multiplayer
                    }
                }
            }
            else if (incomingMsg.action == "move") {
                console.log(user + " moving in game  " + usersGameNumber + " currentplayer is " + games[usersGameNumber]["currentPlayer"])
                for(let i=0; i<games[usersGameNumber]["playerCount"]; i++) {
                    let userString = games[usersGameNumber]["players"][i]["user"]
                    if (userString == user && games[usersGameNumber]["currentPlayer"] == i) {
                        console.log(user + " playing " + usersGameNumber)
                        move(incomingMsg, usersGameNumber)
                        break // because local multiplayer
                    }
                    else {
                        console.log(user + " fail " + userString)
                    }
                }


            }
            else if (incomingMsg.action == "buildRobot") {
                console.log(user + " building robot in game  " + usersGameNumber + " currentplayer is " + games[usersGameNumber]["currentPlayer"])
                for(let i=0; i<games[usersGameNumber]["playerCount"]; i++) {
                    let userString = games[usersGameNumber]["players"][i]["user"]
                    if (userString == user && games[usersGameNumber]["currentPlayer"] == i) {
                        console.log(user + " building " + usersGameNumber)
                        buildRobot(incomingMsg, usersGameNumber)
                    }
                }
                
            }
            else if (incomingMsg.action == "attack") {
                console.log(user + " attacking in game  " + usersGameNumber + " currentplayer is " + games[usersGameNumber]["currentPlayer"])
                for(let i=0; i<games[usersGameNumber]["playerCount"]; i++) {
                    let userString = games[usersGameNumber]["players"][i]["user"]
                    if (userString == user && games[usersGameNumber]["currentPlayer"] == i) {
                        console.log(user + " attack " + usersGameNumber)
                        attack(incomingMsg, usersGameNumber)
                    }
                }
                
            }
            else if (incomingMsg.action == "resign") {
                console.log(user + " resigning in game  " + usersGameNumber + " currentplayer is " + games[usersGameNumber]["currentPlayer"])
                for(let i=0; i<games[usersGameNumber]["playerCount"]; i++) {
                    let userString = games[usersGameNumber]["players"][i]["user"]
                    if (userString == user && games[usersGameNumber]["currentPlayer"] == i) {
                        resign(incomingMsg, usersGameNumber)
                        
                    }
                }
            }
            else {
                console.log("action from unknown user (" + user + "): " + incomingMsg.action)
            }

        }
        
    })
})

//             this.ws.send(JSON.stringify({action: "attack", orgX: attacker.mapX, orgY: attacker.mapY, destX: target, destY: destY, frame:attacker.sprite.frame}))

function resign(incomingMsg, gameNumber) {

    games[gameNumber]["onGoing"] = false
    let returnStatus = "gameOver"
    let sentUsers = {}
    let users = games[gameNumber]["players"]
    for (let user=0; user<users.length; user++) {
        let userString = games[gameNumber]["players"][user]["user"]
        let payload = new Object()
        payload["status"] = returnStatus
        payload["loser"] = games[gameNumber]["currentPlayer"]
        console.log("in attack loop " + user + " /" + userString )

        if (sentUsers[userString] != undefined) {
        }
        else {
            games[gameNumber]["players"][user]["ws"].send(JSON.stringify(payload))
            sentUsers[userString] = true
            console.log( "sending " + payload["status"] + " to " + userString)
            console.log(JSON.stringify(sentUsers))
            delete staticUsers[userString]
        }
    }    
}

function attack(incomingMsg, gameNumber) {
    let sentUsers = {}

    let returnStatus = "attackFAIL"

    let robots = games[gameNumber]["robots"]
    let newX = 0
    let newY = 0
    let newBattery = 0
    console.log("robots size " + robots.length)

    for(let i=0; i<robots.length; i++) {
        console.log("looking for attacker " + robots[i].x + "," + robots[i].y + " (frame " + robots[i].frame + ")")
        if(!robots[i].dead && robots[i].x == incomingMsg.orgX && robots[i].y == incomingMsg.orgY && robots[i].battery >= robots[i].attackCost
            && robots[i].frame != 5 && robots[i].frame != 6 && robots[i].frame != 12) {
            
            console.log("found attacker " + robots[i].x + "/" + robots[i].y)
            for(let j=0; j<robots.length; j++) {
                console.log("looking for target at  " + incomingMsg.destX + "/" + incomingMsg.destY + ": " + robots[j].x + "," + robots[j].y + " (frame " + robots[i].frame + ")")
                if(!robots[j].dead && robots[j].x == incomingMsg.destX && robots[j].y == incomingMsg.destY && (j != i || robots[i].frame == 7 || robots[i].frame == 13)
                    && robots[j].frame != 5 && robots[j].frame != 6 && robots[j].frame != 12) {
                    console.log("found target " + robots[j].x + "/" + robots[j].y)
                    robots[i].battery -= robots[i].attackCost
                    robots[j].defence -= robots[i].attack
                    if (robots[j].defence < 1) {
                        robots[j].dead = true
                    }
                    returnStatus = "attackOK"
                    checkWin(gameNumber)
                    break
                }
            }
            if(robots[i].frame == 11 || robots[i].frame == 17) {
                returnStatus = "attackOK"
                robots[i].battery -= robots[i].attackCost
            }


            // collateral damage?
            if (robots[i].frame == 7 || robots[i].frame == 13 || robots[i].frame == 11 || robots[i].frame == 17) {
                console.log("boom")
                /*
  found target 2/3
boom
x/y:-1/-1
x/y:-1/0
x/y:-1/1
x/y:0/-1
x/y:0/1
x/y:1/0
in attack loop 0 /CS914c0vt+hjlBtaeMhceQ==
            
                */
                calculateCollateralDamage(incomingMsg, gameNumber, robots[i])
                checkWin(gameNumber)

            }
            break
            
        }
    }

    //games[usersGameNumber]["players"][i]["user"]
    let users = games[gameNumber]["players"]
    for (let user=0; user<users.length; user++) {
        let userString = games[gameNumber]["players"][user]["user"]
        let payload = new Object()
        payload["status"] = returnStatus
        payload["robots"] = robots
        payload["currentPlayer"] = games[gameNumber]["currentPlayer"]
        console.log("in attack loop " + user + " /" + userString )

        if (sentUsers[userString] != undefined) {
        }
        else {
            games[gameNumber]["players"][user]["ws"].send(JSON.stringify(payload))
            sentUsers[userString] = true
            console.log( "sending " + payload["status"] + " to " + userString)
            console.log(JSON.stringify(sentUsers))
        }
    }    
}

function calculateCollateralDamage(incomingMsg, gameNumber, attacker) {
    let colOffset = 1
    if (incomingMsg.destY%2==0) {
        colOffset = 0
    }
    let rowOffset = 0
    let minX = -1
    let minY = -1
    let maxX = 1
    let maxY = 1

    let robots = games[gameNumber]["robots"]
    let validAttack = true

    for (let x=minX; x<=maxX; x++) {
        for (let y=minY; y<=maxY; y++) {
            if(x==0 && y==0 || x==maxX && y==minY || x==maxX && y==maxY || x==maxX && y!=0) {
            }
            else {
                if (incomingMsg.destY%2==0) {
                    rowOffset = 0
                }
                else if(y==0) {
                    rowOffset = -1
                }
                else {
                    rowOffset = 0
                }
                console.log("x/y:" + x + "/" + y)
                //oops forgot it checks faction. HACK: "foo"
                if (canTarget(incomingMsg.destX + x + colOffset  + rowOffset , incomingMsg.destY + y, "foo", attacker.frame, gameNumber)) {
                    let collateral = getTarget(incomingMsg.destX + x + colOffset  + rowOffset , incomingMsg.destY + y, "foo", attacker.frame, gameNumber)
                    if (collateral != null) {
                        console.log("found collateral " + collateral.frame)
                        for (let i=0; i<robots.length; i++) {
                            if (collateral == robots[i]) {
                                console.log("damaging " + collateral.frame)
                                collateral.defence -= attacker.attack
                            }
                        }
                        //collateral.defence -= attacker.attack
                        if (collateral.defence < 1) {
                            collateral.dead = true
                        }

                    }
                }
            }
        }
    }            
    return validAttack

}
function canMove(x, y) {
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
    }
    return false
}

function canTarget(x, y, faction, robotType, gameNumber) {

    let robots = games[gameNumber]["robots"]

    if( x < 0 || x >= this.width || y < 0 || y >= this.height ) {
        return false
    }
    let mapTile = games[gameNumber]["map"][y][x] //this.map["map"][y][x]
    if (mapTile == -1) {
        return false
    }
    if (robotType == 11 || robotType == 17) {
        return true
    }


    if (blockerTiles.indexOf(mapTile) == -1) {
        for(let i=0; i<robots.length; i++) {
           
            if (robots[i].dead==false && robots[i].frame != 5 && robots[i].frame != 6 && robots[i].frame != 12 
                && robots[i].x == x && robots[i].y == y && (robotType === 11 || robotType === 17 || robots[i].faction != faction) ) {
                return true
            }
        }
    }
    return false
}
function getTarget(x, y, faction, robotType, gameNumber) {

    let robots = games[gameNumber]["robots"]
    let mapTile = games[gameNumber]["map"][y][x]

    if (blockerTiles.indexOf(mapTile) == -1) {
        for(let i=0; i<robots.length; i++) {
           // console.log("ro" + robotType)
            if (robots[i].dead==false && robots[i].frame != 5 && robots[i].frame != 6 && robots[i].frame != 12 
                && robots[i].x == x && robots[i].y == y && (robotType === 11 || robotType === 17 || robots[i].faction != faction) ) {
                return robots[i]
            }
        }
    }
    return null
}


function checkWin(gameNumber) {
    /*
    recall: 

this.players[0] = "Big E Corporate"
this.players[1] = "Blue Sun"        
        */
    let p0HasUnit = false
    let p0HasFactory = false        
    let p1HasUnit = false
    let p1HasFactory = false        

    let robots = games[gameNumber]["robots"]
    //let cur = games[staticGameNumber]["currentPlayer"]

    for(let i=0; i<robots.length; i++) {

        if(robots[i].dead == false)  {
            if(robots[i].frame == 6 || robots[i].frame == 12) {
                if(robots[i].faction == factions[0]) {
                    p0HasFactory = true
                    console.log("1")
                }
                else if(robots[i].faction == factions[1]) {
                    p1HasFactory = true
                    console.log("2")
                }
            }
            else {
                if(robots[i].faction == factions[0]) {
                    p0HasUnit = true
                    console.log("3")
                }
                else if(robots[i].faction == factions[1]) {
                    p1HasUnit = true
                    console.log("4")
                }
            }
        }
    
    }
    console.log("grasttest1")
    if (!p0HasUnit && !p0HasFactory) {
        console.log("grast1")
        announceWin(gameNumber, 1)
    }
    else if (!p1HasUnit && !p1HasFactory) {
        console.log("grast0")
        announceWin(gameNumber, 0)
    }

}

function announceWin(gameNumber, pl) {

    games[gameNumber]["onGoing"] = false
    let returnStatus = "gameOver"
    let sentUsers = {}
    let users = games[gameNumber]["players"]
    for (let user=0; user<users.length; user++) {
        let userString = games[gameNumber]["players"][user]["user"]
        let payload = new Object()
        payload["status"] = returnStatus
        payload["loser"] = pl
        console.log("in attack loop " + user + " /" + userString )

        if (sentUsers[userString] != undefined) {
        }
        else {
            games[gameNumber]["players"][user]["ws"].send(JSON.stringify(payload))
            sentUsers[userString] = true
            console.log( "sending " + payload["status"] + " to " + userString)
            console.log(JSON.stringify(sentUsers))
            delete staticUsers[userString]
        }
    }    

}

function move(incomingMsg, gameNumber) {
    let sentUsers = {}

    let returnStatus = "moveFAIL"

    let robots = games[gameNumber]["robots"]
    let newX = 0
    let newY = 0
    let newBattery = 0

    for(let i=0; i<robots.length; i++) {
        console.log("is it " + robots[i].x + "," + robots[i].y + " (frame " + robots[i].frame + ")")
        if(!robots[i].dead && robots[i].x == incomingMsg.orgX && robots[i].y == incomingMsg.orgY && robots[i].battery >= robots[i].moveCost
            && robots[i].frame != 5 && robots[i].frame != 6 && robots[i].frame != 12) {
            // TODO: actually check
        console.log("yes " + robots[i].x + "/" + robots[i].y)
            robots[i].x = incomingMsg.destX
            robots[i].y = incomingMsg.destY
            newX = robots[i].x
            newY = robots[i].y
            robots[i].battery -= robots[i].moveCost
            newBattery = robots[i].battery
            if (robots[i].canClaim) {
                for(let j=0; j<robots.length; j++) {
                    console.log("is it " + robots[j].x + "," + robots[j].y)
                    if(!robots[j].dead && robots[j].x == incomingMsg.destX && robots[j].y == incomingMsg.destY
                      && (robots[j].frame == 5 || robots[j].frame == 6 || robots[j].frame == 12)) {
                        if (games[gameNumber]["currentPlayer"]==0) {
                            robots[j].frame = 12
                            robots[j].faction = factions[1]
                        }
                        else {
                            robots[j].frame = 6
                            robots[j].faction = factions[0]
                        }
                        checkWin(gameNumber)

                    }
                }
            }

            returnStatus = "moveOK"
        }
    }
    //games[usersGameNumber]["players"][i]["user"]
    let users = games[gameNumber]["players"]
    for (let user=0; user<users.length; user++) {
        let userString = games[gameNumber]["players"][user]["user"]
        let payload = new Object()
        payload["status"] = returnStatus
        payload["robots"] = robots
        payload["currentPlayer"] = games[gameNumber]["currentPlayer"]
        console.log("in loop " + user + " /" + userString )

        if (sentUsers[userString] != undefined) {
        }
        else {
            games[gameNumber]["players"][user]["ws"].send(JSON.stringify(payload))
            sentUsers[userString] = true
            console.log( "sending " + payload["status"] + " to " + userString)
            console.log(JSON.stringify(sentUsers))
        }
    }
}

function buildRobot(incomingMsg, gameNumber) {
//6 uis blue
    let robot = null
    let robots = games[gameNumber]["robots"]
    let returnStatus = "robotBuildFail"
    for(let i=0; i<robots.length; i++) {
        if(!robots[i].dead && robots[i].x == incomingMsg.mapX && robots[i].y == incomingMsg.mapY
            && ((robots[i].frame == 6 && games[gameNumber]["currentPlayer"] == 1 ) || 
                (robots[i].frame == 12 && games[gameNumber]["currentPlayer"] == 0))) {
            robot = robots[i]
        returnStatus = "foundRobot"
        }
    }

    // find battery cost based on frame
    let frame = incomingMsg.frame
    let unitCost = 4

    let batt = 6
    let canClaim = false
    let attackCost = 4
    let attack = 0
    let defence = 0
    let faction = "Neutral"
    if (frame >= 12) {
        faction = factions[1]
    }
    else {
         faction = factions[0]
    }

    if (frame == 5) {
        batt = 0
        attackCost = 0
        faction = "Neutral"
    }
    else if (frame == 7 || frame == 13) {
        batt = 4
        attackCost = 0
        attack = 2
        defence = 1
        unitCost = 1
    }
    else if (frame == 8 || frame == 14) {
        batt = 3
        canClaim = true
        attackCost = 1
        attack = 1
        defence = 1
        unitCost = 1
    }
    else if (frame == 9 || frame == 15) {
        batt = 7
        attackCost = 4
        defence = 1
        attack = 5
        defence = 8
        unitCost = 3
    }
    else if (frame == 10 || frame == 16) {
        batt = 7
        canClaim = true
        attackCost = 1
        attack = 2
        defence = 5
        unitCost = 3
    }
    else if (frame == 11 || frame == 17) {
        batt = 6
        attackCost = 3
        attack = 2
        defence = 5
        unitCost = 4
    }
    else if (frame == 6 || frame == 12) {
        batt = 1
        attackCost = 0
    }

    // find available battery in the unit we're building in
    // find robot, and use the server's data

    if (robot != null && robot.battery >= unitCost) {
        robot.battery -= unitCost
        games[gameNumber]["robots"].push( {y:incomingMsg.mapY, x:incomingMsg.mapX, frame:frame, battery:batt, maxBattery:batt, moveCost:1, canClaim:canClaim, dead:false, attackCost:attackCost, attack:attack, defence:defence})
        returnStatus = "robotBuildOK"
    }
               //map[i]["robots"].push( {y:y, x:x, frame:frame, battery:batt, maxBattery:batt, moveCost:1, canClaim:canClaim, dead:false, attackCost:attackCost, attack:attack, defence:defence} )
    let sentUsers = {}
    let users = games[gameNumber]["players"]
    for (let user=0; user<users.length; user++) {
        let userString = games[gameNumber]["players"][user]["user"]
        let payload = new Object()
        payload["status"] = returnStatus
        payload["robots"] = robots
        payload["frame"] = incomingMsg.frame
        payload["mapX"] = incomingMsg.mapX
        payload["mapY"] = incomingMsg.mapY
        console.log("in loop " + user + " /" + userString )

        if (sentUsers[userString] != undefined) {
        }
        else {
            games[gameNumber]["players"][user]["ws"].send(JSON.stringify(payload))
            sentUsers[userString] = true
            console.log( "sending " + payload["status"] + " to " + userString)
            console.log(JSON.stringify(sentUsers))
        }
    }

}

function endTurn(incomingMsg, gameNumber) {
    let sentUsers = {}
    let users = games[gameNumber]["players"]
    
    games[gameNumber]["currentPlayer"] = games[gameNumber]["currentPlayer"] +1//)% games[gameNumber]["playerCount"]
    games[gameNumber]["currentPlayer"] = games[gameNumber]["currentPlayer"] % 2

    let robots = games[gameNumber]["robots"]
    for(let i=0; i<robots.length; i++) {
        if(!robots[i].dead && robots[i].battery < robots[i].maxBattery && robots[i].frame != 5) { 
            robots[i].battery = robots[i].battery + 1
            
        }
    }

    for (let user=0; user<users.length; user++) {
        let userString = games[gameNumber]["players"][user]["user"]
        let payload = new Object()
        payload["status"] = "newTurn"
        payload["robots"] = robots
        payload["currentPlayer"] = games[gameNumber]["currentPlayer"]
        payload["opponentNick"] = incomingMsg.nick
        console.log("in loop " + user + " /" + users[user] )

        if (sentUsers[userString] != undefined) {
        }
        else {
            games[gameNumber]["players"][user]["ws"].send(JSON.stringify(payload))
            sentUsers[userString] = true
            console.log( "sending " + payload["status"] + " to " + userString)
            console.log(JSON.stringify(sentUsers))
        }
    }

}

function startNewGame(ws, users, gameType, mapNum) {
    staticGameNumber++
    games[staticGameNumber] = {}
    games[staticGameNumber]["gameNumber"] = staticGameNumber
    games[staticGameNumber]["playerCount"] = users.length
    games[staticGameNumber]["players"] = [users.length]
    games[staticGameNumber]["currentPlayer"] = getRandomInt(0, users.length)
    games[staticGameNumber]["mapNum"] = mapNum


    //console.log( users.length + " users : " + JSON.stringify(users) + " , " + gameType + ", map: " + mapNum)

    for (let x=0; x<users.length; x++) {
        games[staticGameNumber]["players"][x] = {}
        games[staticGameNumber]["players"][x]["user"] = users[x]
        games[staticGameNumber]["players"][x]["ws"] = ws[x]
        games[staticGameNumber]["players"][x]["batteryBonus"] = 0 // run through robots of this faction, give them bonus
        if (users[x] != games[staticGameNumber]["nextPlayer"]) {
            games[staticGameNumber]["players"][x]["batteryBonus"] = 1
        }
        
    }

    games[staticGameNumber]["gameType"] = gameType
    games[staticGameNumber]["turn"] = 0
    games[staticGameNumber]["map"] = JSON.parse(JSON.stringify(map[mapNum]["map"]))
    games[staticGameNumber]["robots"] = JSON.parse(JSON.stringify(map[mapNum]["robots"]))
    games[staticGameNumber]["onGoing"] = true  

    let sentUsers = {}

    for (let user=0; user<users.length; user++) {
        let payload = new Object();
        let userString = games[staticGameNumber]["players"][user]["user"]
        payload["status"] = "gameStarted"
        payload["robots"] = games[staticGameNumber]["robots"]
        payload["playerCount"] = games[staticGameNumber]["playerCount"]
        payload["currentPlayer"] = games[staticGameNumber]["currentPlayer"]
        payload["playerNumber"] = user
        payload["mapNum"] = games[staticGameNumber]["mapNum"]
        // also send batterybonus
//console.log("sending payload " + JSON.stringify(payload))
        if (sentUsers[userString] != undefined) {
        }
        else {
            games[staticGameNumber]["players"][user]["ws"].send(JSON.stringify(payload))
            sentUsers[userString] = true
            console.log( "sending gameStarted to " + users[user] + " robots: " + payload["robots"])
            console.log(JSON.stringify(sentUsers))
        }

    }


    return staticGameNumber

}

let fs = require('fs')

let arg = process.argv[2]

function getDateTime() {

    let date = new Date();

    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    let min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    let sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    let year = date.getFullYear();

    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    let day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;

}



function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}



function distanceBetweenTwoPoints(a, b) {
    var xs = b.x - a.x;
    xs = xs * xs;

    var ys = b.y - a.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
}