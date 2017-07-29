let WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8988})

console.log('Server started on 8988')


let players = []
currentPlayer = 0

let start_x = 4
let start_y = 2

let next_player_id = 0


// TODO: multiple
let parsedJSON = require('../client/static/assets/tilemaps/map0.json')

let height = parsedJSON.height
let width = parsedJSON.width


let map = []
map[0] = {}
map[0]["map"] = []
map[0]["robots"] = []

console.log(parsedJSON)
let x = 0
let y = 0
for (let tile in parsedJSON.layers[0].data) {
    //console.log("tile:" + tile)
    //if (parsedJSON.layers[0].data[tile] >= 0) {
        //let sprite = this.game.add.sprite(startX + offset + x*32, startY + y*24, 'tiles')
        //sprite.frame = parsedJSON.layers[0].data[tile] - 1
        if (undefined == map[0]["map"][y]) {
            map[0]["map"][y] = [height]
        }
        if (undefined == map[0]["map"][y][x]) {
            map[0]["map"][y][x] = [width]
        }
        map[0]["map"][y][x] = parsedJSON.layers[0].data[tile] - 1
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
        if (map[0]["map"][y][x].toString().length < 2) {
            buffer += " "
        }
        buffer += map[0]["map"][y][x] + ", "
    }
    buffer += "\n"
}
console.log("loaded map:\n" + buffer)

x = 0
y = 0
for (let tile in parsedJSON.layers[1].data) {
//        if (undefined == map[0]["robots"][y]) {
//            map[0]["robots"][y] = [height]
//        }
//        if (undefined == map[0]["robots"][y][x]) {
//            map[0]["robots"][y][x] = [width]
//        }
    if (parsedJSON.layers[1].data[tile] > 0) {
       map[0]["robots"].push( {y:y, x:x, frame:parsedJSON.layers[1].data[tile] - 1} )
    }

    x+=1
    if (x%width == 0) {
        y+=1
        x=0
    }

        //console.log("hey: " + x + "," + y + " : " + map[0]["map"][y][x])
    //}

}
/*
buffer = ""
for (let y=0; y<height; y++) {
    for (let x=0; x<width; x++) {
        if (map[0]["robots"][y][x].toString().length < 2) {
            buffer += " "
        }
        buffer += map[0]["robots"][y][x] + ", "
    }
    buffer += "\n"
}
console.log("loaded robots:\n" + buffer)
*/
let turn = 0

/*
for(var y=0; y < height; y++) {
    map[y] = [height]
        for(var x=0; x < width; x++) {
        map[y][x] = parsedJSON.layers[1].data[z];
        //console.log(parsedJSON[z]);
        z++;

    }
}


var robots = [];

for (robot in parsedJSON.layers[2].objects) {
    console.log(parsedJSON.layers[2].objects[robot]);
    var type = parsedJSON.layers[2].objects[item].properties.type;
    var x = parseInt(parsedJSON.layers[2].objects[item].x/32);
    var y = parseInt(parsedJSON.layers[2].objects[item].y/32);
    for (item in items) {
        if (items[item].type == type) {
            items[item].x = x;
            items[item].y = y;
        }
    }
}

for (item in items) {
    console.log(items[item].type + ": " + items[item].x + "/" + items[item].y);
}


var buffer = "";
for(var y=0; y < height; y++) {
  for(var x=0; x < width; x++) {
    if (map[y][x] < 10) {
        buffer += " ";
    }
    if (map[y][x] == 0) {
        buffer += " , ";
    }
    else {
        buffer += map[y][x] + ", ";
    }
  }
  buffer += "\n"
}

console.log(buffer);
/*
{ "height":20,
 "layers":[
        {
         "data"
*/
let users = {}
let games = {}
let gameNumber = 0
let earliestOnGoingGame = 0

wss.on('connection', function(ws) {

    console.log('connected: ' + ws.upgradeReq.headers['sec-websocket-key'])
    var user = ws.upgradeReq.headers['sec-websocket-key']
//    console.log('connected: ' + ws.upgradeReq.headers['sec-websocket-key']);
    if (user in users) {
        console.log("user already registered?")
    }
    else {
        users[user] = {}

        let payload = new Object()
        payload["status"] = "registered"
        console.log("registration: #" + " (" + user + ")")
        ws.send(JSON.stringify(payload))
    }

    ws.on('message', function(message) {       
        let incomingMsg = JSON.parse(message);
        if (user in users) {
            
            //players[users[user]].action = incomingMsg.action;
            //console.log("action from #" + users[user] + " " + players[users[user]].nick + ": " + incomingMsg.action);
            console.log("action from #" + users[user] + " (current nick: " + users[user].nick + ") " + ": " + incomingMsg.action + " [" + incomingMsg.nick + "]")
            for ( a in incomingMsg) { console.log(a + ": " + incomingMsg[a])}

            if (incomingMsg.action == "setNick") {
                if (incomingMsg.nick == null || incomingMsg.nick == undefined || incomingMsg.nick == "" || incomingMsg["nick"] == undefined) {
                    if (users[user] != undefined && (users[user].nick == null || users[user].nick == undefined || users[user].nick == "" || users[user]["nick"] == undefined)) {
                        users[user].nick = "Dr. Rust"
                    }
                }
                else {
                    users[user].nick = incomingMsg.nick
                }

                console.log(user + " setNick to : " + users[user].nick)

                let payload = new Object();
                payload["status"] = "nickChanged";
                payload["nick"] = users[user].nick
                ws.send(JSON.stringify(payload));
            }
            else if (incomingMsg.action == "findGame") {
                if (incomingMsg.gameType == "local") {
                    let usersInGame = [2]
                    usersInGame[0] = user
                    usersInGame[1] = user
                    startNewGame(ws, usersInGame, "local", 0)
                }
                // if another findGame, join and send Start
                // type: local = just start immediately, assume client will send both p1 and p2 (>2?)
                // ,ai,
                // ,online
                // also provide map (or random)

            }

        }
        else {
            console.log("action from unknown user (" + user + "): " + incomingMsg.action)
        }

        
        
    });
});


function startNewGame(ws, users, gameType, mapNum) {
    games[gameNumber] = {}
    games[gameNumber]["gameNumber"] = gameNumber
    games[gameNumber]["playerCount"] = users.length
    games[gameNumber]["players"] = [users.length]
    games[gameNumber]["nextPlayer"] = getRandomInt(1, users.length)
    games[gameNumber]["mapNum"] = mapNum

    console.log( users.length + " users : " + JSON.stringify(users) + " , " + gameType + ", map: " + mapNum)

    for (let x=0; x<users.length; x++) {
        games[gameNumber]["players"][x] = {}
        games[gameNumber]["players"][x]["user"] = users[x]
        games[gameNumber]["players"][x]["parts"] = 0
        if (users[x] != games[gameNumber]["nextPlayer"]) {
            games[gameNumber]["players"][x]["parts"] = 50
        }
        
    }

/*    game[gameNumber]["player1"] = user[0]
    if (users.length > 1) {
        game[gameNumber]["player2"] = user[1]
    }
    if (users.length > 2) {
        game[gameNumber]["player3"] = user[2]
    }
    if (users.length > 3) {
        game[gameNumber]["player4"] = user[3]
    }
    */
    games[gameNumber]["gameType"] = gameType
    games[gameNumber]["turn"] = 0
    games[gameNumber]["map"] = map[0]["map"]
    games[gameNumber]["robots"] = map[0]["robots"]
    games[gameNumber]["onGoing"] = true
console.log( games[gameNumber]["robots"])
    

    let sentUsers = {}
    for (user in users) {
        let payload = new Object();
        payload["status"] = "gameStarted"
        payload["robots"] = games[gameNumber]["robots"]
        if (sentUsers[users[user]] != undefined) {
        }
        else {
            ws.send(JSON.stringify(payload))
            sentUsers[users[user]] = true
            console.log( "sending gameStarted to " + users[user] + " robots: " + payload["robots"])
            console.log(JSON.stringify(sentUsers))
        }

    }


    gameNumber++

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


function attack(player) {

    var x = player.x;
    var y = player.y;
    if (player.action == "left") {
        x -= 1;
    }
    else if (player.action == "right") {
        x += 1;
    }
    else if (player.action == "up") {
        y -= 1;
    }
    else if (player.action == "down") {
        y += 1;
    }

    for(var i = 0; i < players.length; i++) {
        if (player.nick != players[i].nick && players[i].life > 0 && players[i].x == x && players[i].y == y) {
            // yey
            var bonus = 0;
            var abort = false;
            if (player.action == "left" && map[players[i].y][players[i].x-1] <= last_walkable_tile) {
                for(var j = 0; j < players.length; j++) {
                    if (players[i].nick != players[j].nick && players[i].x-1 == players[j].x && players[i].y == players[j].y) {
                        abort = true;
                        break;
                    }
                }
                if (!abort) {
                    players[i].x -= 1;
                }
            }
            else if (player.action == "right" && map[players[i].y][players[i].x+1] <= last_walkable_tile) {
                for(var j = 0; j < players.length; j++) {
                    if (players[i].nick != players[j].nick && players[i].x+1 == players[j].x && players[i].y == players[j].y) {
                        abort = true;
                        break;
                    }
                }
                if (!abort) {
                    players[i].x += 1;
                }
            }
            else if (player.action == "up" && map[players[i].y-1][players[i].x] <= last_walkable_tile) {
                for(var j = 0; j < players.length; j++) {
                    if (players[i].nick != players[j].nick && players[i].x == players[j].x && players[i].y-1 == players[j].y) {
                        abort = true;
                        break;
                    }
                }
                if (!abort) {
                    players[i].y -= 1;
                }
            }
            else if (player.action == "down" && map[players[i].y+1][players[i].x] <= last_walkable_tile) {
                for(var j = 0; j < players.length; j++) {
                    if (players[i].nick != players[j].nick && players[i].x == players[j].x && players[i].y+1 == players[j].y) {
                        abort = true;
                        break;
                    }
                }
                if (!abort) {
                    players[i].y += 1;
                }
            }
            else {
                bonus = 2;
            }

            var defence = 0;
            var armour = false;
            var shield = false;
            var helmet = false;

            for (item in items) {
                if (items[item].owner == players[i].nick) {
                    if (items[item].type == "armour1" || items[item].type == "armour2") {
                        armour = true;
                    }
                    else if (items[item].type == "helm1" || items[item].type == "helm2" || items[item].type == "helm3") {
                        helmet = true;
                    }
                    else if (items[item].type == "shield1" || items[item].type == "shield2" 
                        || items[item].type == "shield3" || items[item].type == "shield4") {
                        shield = true;
                    }
                }
                if (items[item].owner == player.nick && items[item].type == "sword") {
                    bonus += 2;
                }
            }

            if (armour) {
                defence += 2;
            }
            if (shield) {
                defence += 1;
            }
            if (helmet) {
                defence += 1;
            }

            var payload = new Object();
            
        if (getRandomInt(1,11) + bonus - defence > 5) {
                players[i].life -= 1;
                
                if (players[i].life == 0) {
                    payload["status"] = "death";
                }
                else {
                    payload["status"] = "hit";
                }
            }
            else {
                payload["status"] = "miss";

            }
            //console.log("sending " + payload.toString());

            for(var j in wss.clients) {
                var key = users[wss.clients[j].upgradeReq.headers['sec-websocket-key']];
                if (key == i || players[key].nick == player.nick) {
                    wss.clients[j].send(JSON.stringify(payload));
                }
            }


            // kill confirmed
            if (players[i].life == 0) {
                dropItems(players[i], player.action, false);
                players[i].x = -100;
            }

            return true;
        }
    }
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

function process_and_send_events() {
    turn++;
    //console.log("Turn " + turn);
    for (let i=earliestOnGoingGame; i<gameNumber; i++) {
        if (games[i]["onGoing"] != undefined && games[i]["onGoing"] == true) {
            console.log("active game: " + games[i]["gameNumber"])
        }
    }
    for(var i = 0; i < players.length; i++) {

        if (players[i].bot == true) {
            for(var j = 0; j < players.length; j++) {
                
                if (i != j && distanceBetweenTwoPoints(players[i], players[j]) <= 5) {
                    var choice = getRandomInt(1,13);
                    if (choice < 5) {
                        if (players[i].x < players[j].x) {
                            players[i].action = "right";
                        }
                        else if (players[i].x > players[j].x) {
                            players[i].action = "left";
                        }
                        else {
                            if (players[i].y > players[j].y) {
                                players[i].action = "up";
                            }
                            else if (players[i].y < players[j].y) {
                                players[i].action = "down";
                            }
                        }
                    }
                    else if (choice > 7) {
                        if (players[i].y > players[j].y) {
                            players[i].action = "up";
                        }
                        else if (players[i].y < players[j].y) {
                            players[i].action = "down";
                        }
                        else {
                            if (players[i].x < players[j].x) {
                                players[i].action = "right";
                            }
                            else if (players[i].x > players[j].x) {
                                players[i].action = "left";
                            }
                        }
                    }
                    else {
                        var choice = getRandomInt(1,8);
                        switch (choice) {
                            case 1: players[i].action = "left"; break;
                            case 2: players[i].action = "right"; break;
                            case 3: players[i].action = "up"; break;
                            case 4: players[i].action = "down"; break;
                        }
                    }
                }
            }
        }
        
        if (players[i].action == "left") {

            if (attack(players[i])) {

            }
            else if (players[i].x > 0 && map[players[i].y][players[i].x-1] <= last_walkable_tile) {
                players[i].x -= 1;
            }
        }
        else if (players[i].action == "right") {
            if (attack(players[i])) {

            }
            else if (players[i].x < width-1 && map[players[i].y][players[i].x+1] <= last_walkable_tile) {
                players[i].x += 1;
            }
        }
        else if (players[i].action == "up") {
            if (attack(players[i])) {

            }
            else if (players[i].y > 0 && map[players[i].y-1][players[i].x] <= last_walkable_tile) {
                players[i].y -= 1;
            }
        }
        else if (players[i].action == "down") {
            if (attack(players[i])) {

            }
            else if (players[i].y < height-1 && map[players[i].y+1][players[i].x] <= last_walkable_tile) {
                players[i].y += 1;
            }
        }
        if (map[players[i].y][players[i].x] < last_lava_tile && map[players[i].y][players[i].x] > 1) {
            players[i].life = 0;
            dropItems(players[i], players[i].action, false);
            players[i].x = -100;

            var payload = new Object();
            payload["status"] = "death_by_lava";
            for(var j in wss.clients) {
                // in lava, everyone can hear you scream
                wss.clients[j].send(JSON.stringify(payload));
            }

        }

        if (map[players[i].y][players[i].x] == 75) {
            var payload = new Object();
            payload["status"] = "exit";
            
            payload["player"] = players[i];
            //console.log("sending " + payload.toString());
            for(var j in wss.clients) {
                if (users[wss.clients[j].upgradeReq.headers['sec-websocket-key']] == i) {
                    wss.clients[j].send(JSON.stringify(payload));
                }
            }
            players[i].life = 0;
            dropItems(players[i], players[i].action, true);
            players[i].x = -100;

        }

        var calc = false;
        for (item in items) {
            if (items[item].owner == "" && items[item].dead == false && items[item].x == players[i].x && items[item].y == players[i].y 
                && notDuplicate(players[i], items[item])) {
                items[item].x = -100;
                if (items[item].type == "potion1" || items[item].type == "potion2" 
                     || items[item].type == "potion3") {
                    items[item].dead = true;
                    players[i].life = 3;
                } 
                else if (items[item].type == "pineapple") {
                    items[item].dead = true;
                }
                else {
                    items[item].owner = players[i].nick;
                    calc = true;                    
                }
            }
        }
        if (calc) {
            calculateAndSetItems(i);
        }
        players[i].action = "";

    }

    var payload = {};
    payload["players"] = players;
//    payload["items"] = items;
    for(var i in wss.clients) {
        wss.clients[i].send(JSON.stringify(payload));
    }
}
setInterval(process_and_send_events, 400);
    
