
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

async function deleteMessages() {
    const fetched = await channel.fetchMessages({ limit: 99 });
    channel.bulkDelete(fetched);
}

module.exports = {
    name: 'place',
    description: 'places 1 card',
    execute(message, args) {
        const discCommand = message.content;
        console.log("hello??");
        //const channel = client.channels.cache.find(channel => channel.name === "current-board");
        let channel = message.guild.channels.cache.find(
            channel => channel.name.toLowerCase() === "current-board"
        )
        //let channel = message.guild.channels.find('name', 'current-board');
        deleteMessages();
        //channel.send('test?');
    },
};