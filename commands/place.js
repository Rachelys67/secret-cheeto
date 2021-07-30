
const Discord = require("discord.js");
var db = require("../RachelSheetsIO.js");
const random = require('random-js');
const { Random } = require("random-js");

async function deleteMessages(channel) {
    const fetched = await channel.messages.fetch({ limit: 99 });
    channel.bulkDelete(fetched);
}

async function determineFacistLink(facistPolicies) {
    //get # players
    var returnURL = "";
    db.exportGetAllPlayers(function (players) {
        //determine board state based on players & policies
        var playerCount = players.length;
        console.log(playerCount);
        if (playerCount > 8) {
            if (facistPolicies == 0) {
                returnURL = "";
            }
            else if (facistPolicies == 1) {
                returnURL = "";
            }
            else if (facistPolicies == 2) {
                returnURL = "";
            }
            else if (facistPolicies == 3) {
                returnURL = "";
            }
            else if (facistPolicies == 4) {
                returnURL = "";
            }
            else {
                returnURL = "";
            }
        }
        else if (playerCount > 6) {
            if (facistPolicies == 0) {
                returnURL = "https://i.imgur.com/8okOSTE.png";
            }
            else if (facistPolicies == 1) {
                returnURL = "https://i.imgur.com/QgETC64.png";
            }
            else if (facistPolicies == 2) {
                returnURL = "https://i.imgur.com/yqCSuCy.png";
            }
            else if (facistPolicies == 3) {
                returnURL = "https://i.imgur.com/9ZTQOrR.png";
            }
            else if (facistPolicies == 4) {
                returnURL = "https://i.imgur.com/sHm76Cf.png";
            }
            else {
                returnURL = "https://i.imgur.com/d4ayrUT.png";
            }
        }
        else {
            if (facistPolicies == 0) {
                returnURL = "";
            }
            else if (facistPolicies == 1) {
                returnURL = "";
            }
            else if (facistPolicies == 2) {
                returnURL = "";
            }
            else if (facistPolicies == 3) {
                returnURL = "";
            }
            else if (facistPolicies == 4) {
                returnURL = "";
            }
            else {
                returnURL = "";
            }
        }
    });
    console.log(returnURL);
    return returnURL;
}

module.exports = {
    name: 'place',
    description: 'places 1 card',
    async execute(message, args) {
        const discCommand = message.content;

        const issuedCommand = discCommand.split(" ");
        if (issuedCommand.length < 2) {

            const msgEmbed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .addField("Disallowed!", "You MUST put a policy of Facist or Liberal");
            message.channel.send(msgEmbed);
            return;
        }
        var policyName = issuedCommand[1];
        if (policyName != "Liberal" && policyName != "Facist") {

            const msgEmbed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .addField("Disallowed!", "You MUST put a policy of Facist or Liberal");
            message.channel.send(msgEmbed);
            return;
        }
        //const channel = client.channels.cache.find(channel => channel.name === "current-board");
        let channel = message.guild.channels.cache.find(
            channel => channel.name.toLowerCase() === "current-board"
        )
        //let channel = message.guild.channels.find('name', 'current-board');
        await deleteMessages(channel);
        console.log("exp...");
        //channel.send('test?');
        await db.expPlayPolicy(policyName, function () {
            db.getPolicyCounts(async function (facistPolicies, liberalPolicies) {
                if (liberalPolicies == 0) {
                    liberalLink = "https://i.imgur.com/FlmXDry.png";
                }
                else if (liberalPolicies == 1) {
                    liberalLink = "https://i.imgur.com/MVLjFiP.png";
                }
                else if (liberalPolicies == 2) {
                    liberalLink = "https://i.imgur.com/e0XaSbu.png";
                }
                else if (liberalPolicies == 3) {
                    liberalLink = "https://i.imgur.com/dFEkcBU.png";
                }
                else {
                    liberalLink = "https://i.imgur.com/iIKsWmn.png";
                }
                facistLink = await determineFacistLink(facistPolicies);
                console.log(facistLink);

                let facistMsg = new Discord.MessageEmbed()
                    .setImage(facistLink)
                    .setTitle('Current Facist Board')
                    .setColor('#a83432')
                    ;

                let liberalMsg = new Discord.MessageEmbed()
                    .setImage(liberalLink)
                    .setTitle('Current Liberal Board')
                    .setColor('#3275a8')
                    ;
                channel.send(facistMsg);
                channel.send(liberalMsg);
            });
        });
        console.log("do we error before or after???");

        var liberalLink = "";
        var facistLink = "";
        


    },
};