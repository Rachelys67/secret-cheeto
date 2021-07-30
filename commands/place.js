
const Discord = require("discord.js");
var db = require("../RachelSheetsIO.js");
const random = require('random-js');
const { Random } = require("random-js");


var maxFacists = 0;
var maxLiberals = 0;
var currentFacists = 0;
var currentLiberals = 0;
var isCheetoSelected = 0;
const client = new Discord.Client();
module.exports = {
    name: 'place',
    description: 'places 1 card',
    execute(message, args) {
        const discCommand = message.content;
        console.log("hello??");
        //const channel = client.channels.cache.find(channel => channel.name === "current-board");
        let channel = message.guild.channels.get("current-board");
        channel.send('test?');
    },
};