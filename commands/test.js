// JavaScript source code



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
    name: 'test',
    description: 'draws 3 cards',
    execute(message, args) {
        const discCommand = message.content;
        //console.log("hello??");

        let client = message.channel.client;

        var username = client.users.cache.get('189911161091784704');

        let allPolicies = new Discord.MessageEmbed()
            .setTitle('Policies Drawn')
            .addField('Policies', username);
        client.users.fetch(message.author.id).then(user => {
            user.send(allPolicies);
        });
        //runGame(message);
    },
};