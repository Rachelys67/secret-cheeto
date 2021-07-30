
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
    name: 'place',
    description: 'places 1 card',
    execute(message, args) {
        const discCommand = message.content;
        console.log("hello??");

        message.channel.client.get('current-board').send('test?');
    },
};