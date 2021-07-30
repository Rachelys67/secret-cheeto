
const Discord = require("discord.js");
var db = require("../RachelSheetsIO.js");
const random = require('random-js');
const { Random } = require("random-js");


var maxFacists = 0;
var maxLiberals = 0;
var currentFacists = 0;
var currentLiberals = 0;
var isCheetoSelected = 0;

module.exports = {
    name: 'draw',
    description: 'draws 3 cards',
    execute(message, args) {
        const discCommand = message.content;
        console.log("hello??");

        let client = message.channel.client
        let facistMsg = new Discord.MessageEmbed()
            .setImage('https://i.imgur.com/zMf4D4J.png')
            .setTitle('Facist Card Drawn')
            .setColor('#a83432')
            ;
        let liberalMsg = new Discord.MessageEmbed()
            .setImage('https://i.imgur.com/RQ40XLP.png')
            .setTitle('Liberal Card Drawn')
            .setColor('#3275a8')
            ;
        db.drawPolicy(function (cards) {
            var policies = "";
            for (var j = 0; j < 3; j++) {
                policies = policies + cards[j] + " ";
                if (cards[j] == "Liberal") {
                    client.users.fetch(message.author.id).then(user => {
                        user.send(liberalMsg);
                    });
                }
                else {
                    client.users.fetch(message.author.id).then(user => {
                        user.send(facistMsg);
                    });
                }
            }
            let allPolicies = new Discord.MessageEmbed()
                .setTitle('Policies Drawn')
                .addField('Policies', policies);
            client.users.fetch(message.author.id).then(user => {
                user.send(allPolicies);
            });

        });
        //runGame(message);
    },
};