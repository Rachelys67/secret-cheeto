
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

        let client = discMsg.channel.client
        let facistMsg = new Discord.MessageEmbed()
            .setImage('../img/facisttile.png')
            .setTitle('Facist Card Drawn')
            .setColor('#a83432')
            ;
        let liberalMsg = new Discord.MessageEmbed()
            .setImage('../img/liberaltile.png')
            .setTitle('Liberal Card Drawn')
            .setColor('#3275a8')
            ;
        client.users.fetch(message.author.id).then(user => {
            user.send(liberalMsg);
        });
        //db.drawPolicy(function (cards) {
        //    for (var j = 0; j < 3; j++) {
        //        client.users.fetch(message.author.id).then(user => {
        //            user.send(embedMsg);
        //        });
        //        console.log("uhhh...???");
        //        console.log(cards[j]);
        //    }
        //});
        //runGame(message);
    },
};