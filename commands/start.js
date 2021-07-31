
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
        var facists = [];
        var hitler = '';
        var facistCount = 0;
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
                

                if (getRoleNameFromId(role, players.length) == "Facist") {
                    facists[facistCount] = players[i]._rawData[0];
                    facistCount++;
                }
                if (getRoleNameFromId(role, players.length) == "Cheeto in Chief") {
                    hitler = players[i]._rawData[0];
                }
                let clientMsg = "Your role is..." + getRoleNameFromId(role, players.length);

                let embedMsg = new Discord.MessageEmbed()
                    .addField("Role for new game", getRoleNameFromId(role, players.length))
                    ;
                console.log("sending role..." + clientMsg);
                client.users.fetch(id).then(user => {
                    user.send(embedMsg);
                });
            }
            for (var i = 0; i < facists.length; i++) {

                let client = discMsg.channel.client;
                var fellowFacists = "";
                for (var j = 0; j < facists.length; j++) {
                    var facistName = client.users.cache.get(facists[j]);
                    console.log(facists[j]);
                    console.log(facistName);
                    fellowFacists = fellowFacists + " " + facistName;
                    //client.users.fetch(facists[i]).then(user => {
                     //   user.send(facistName);
                    //});
                }
                client.users.fetch(facists[i]).then(user => {
                    user.send("hitler is" + client.users.cache.get(hitler));
                });

                //let embedMsg = new Discord.MessageEmbed()
                //    .addField("Fellow Facists", fellowFacists)
                    ;
            }
            //client.users.cache.get('189911161091784704');
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

async function deleteMessages(channel) {
    const fetched = await channel.messages.fetch({ limit: 99 });
    channel.bulkDelete(fetched);
}
//testClear();


module.exports = {
    name: 'start',
    description: 'starts the active game',
    async execute(message, args) {
        const discCommand = message.content;

        runGame(message);
        var liberalLink = "https://i.imgur.com/FlmXDry.png";
        //const channel = client.channels.cache.find(channel => channel.name === "current-board");
        let channel = message.guild.channels.cache.find(
            channel => channel.name.toLowerCase() === "current-board"
        );
        await deleteMessages(channel);

        let liberalMsg = new Discord.MessageEmbed()
            .setImage(liberalLink)
            .setTitle('Current Liberal Board')
            .setColor('#3275a8')
            ;
        channel.send(liberalMsg);

        db.exportGetAllPlayers(function (players) {
            var playerCount = players.length;
            if (playerCount > 8) {
                returnURL = "https://i.imgur.com/VWimQ3B.jpeg";
            }
            else if (playerCount > 6) {
                returnURL = "https://i.imgur.com/8okOSTE.png";
            }

            let facistMsg = new Discord.MessageEmbed()
                .setImage(returnURL)
                .setTitle('Current Facist Board')
                .setColor('#a83432')
                ;
            channel.send(facistMsg);
        });
    },
};