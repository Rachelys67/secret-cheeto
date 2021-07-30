
const Discord = require("discord.js");
var db = require("../RachelSheetsIO.js");
const random = require('random-js');
const { Random } = require("random-js");


var maxFacists = 0;
var maxLiberals = 0;
var currentFacists = 0;
var currentLiberals = 0;
var isCheetoSelected = 0;

function getRoleNameFromId(roleId, playerCount) {
    //console.log(roleId);
    if (roleId == playerCount) return "Cheeto in Chief"
    else if ((roleId % 2)  == 1) return "Liberal";
    else if ((roleId % 2) == 0) return "Facist";
}

function checkValidRole(roleSelection, playerCount) {

    console.log(currentFacists + " / " + maxFacists);
    console.log(currentLiberals + " / " + maxLiberals);
    console.log(roleSelection % 2);

    if ((roleSelection == playerCount)) {
        if (isCheetoSelected == 0) {
            isCheetoSelected++;
            return true;
        }
        else {
            return false;
        }
    }

    if (((roleSelection % 2) == 1) && (currentLiberals < maxLiberals)) {
        currentLiberals++;
        return true;
    }
    else if (((roleSelection % 2) == 0) && (currentFacists < maxFacists)) {
        currentFacists++;
        return true;
    }

    return false;
}

function assignRole(random, playerCount, maxPlayerCount) {
    var breakInCaseOfInfinity = 0;
    var cheetoSelected = isCheetoSelected;
    if (playerCount != 1) {
        role = parseInt(random.integer(1, playerCount));
        while (checkValidRole(role, playerCount) == false) {
            role = parseInt(random.integer(1, playerCount));
            breakInCaseOfInfinity++;
            if (breakInCaseOfInfinity > 1000) break;
        }
    }
    else {
        if (isCheetoSelected == 0) {
            isCheetoSelected = 1;
        }
        else if (currentLiberals < maxLiberals) {
            role = 1;
        }
        else {
            role = 2;
        }
    }
    if (isCheetoSelected != cheetoSelected) role = maxPlayerCount;
    return role;
}

function determineMaxRoles(playerCount) {
    maxFacists = (Math.ceil(playerCount / 2) - 1)
    maxLiberals = playerCount - maxFacists;
    maxFacists--;
    console.log(maxFacists);
    console.log(maxLiberals);
}

function runGame(discMsg) {
    const random = new Random();
    var playersPicked = 0;
    console.log("starting game...");
    db.exportGetAllPlayers(function (players) {
        console.log(players.length);
        if (players.length >= 5) {
            playersPicked = players.length;
            determineMaxRoles(players.length);
            for (var i = 0; i < players.length; i++) {
                var role = assignRole(random, playersPicked, players.length);
                playersPicked--;
                console.log(players[i]._rawData[0] + " playing as..." + getRoleNameFromId(role, players.length));

                let str = players[i]._rawData[0]; //Just assuming some random tag.
                console.log("player: " + str);

                //removing any sign of < @ ! >... 
                //the exclamation symbol comes if the user has a nickname on the server.
                let id = str.replace(/[<@!>]/g, '');
                let client = discMsg.channel.client;
                let clientMsg = "Your role is..." + getRoleNameFromId(role, players.length);

                let embedMsg = new Discord.MessageEmbed()
                    .addField("Role for new game", getRoleNameFromId(role, players.length))
                    ;
                console.log("sending role..." + clientMsg);
                client.users.fetch(id).then(user => {
                    user.send(embedMsg);
                });
            }
            db.startGame();
        }
        else {
            throw new Error("not enough players...");
        }
    });
}


function testClear() {
   //db.startGame();
    db.drawPolicy(function (cards) {
        for (var j = 0; j < 3; j++) {
            console.log("uhhh...???");
            console.log(cards[j]);
        }
    });
}
//testClear();


module.exports = {
    name: 'start',
    description: 'starts the active game',
    execute(message, args) {
        const discCommand = message.content;
        console.log("hello??");

        runGame(message);
    },
};