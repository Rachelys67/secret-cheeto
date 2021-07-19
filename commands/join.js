const Discord = require("discord.js");
var db = require("../RachelSheetIO.js");

module.exports = {
    name: 'join',
    description: 'adds new player!',
    execute(message, args) {
        const discCommand = message.content;
        const targetID = message.mentions.users.first().id;
        db.addPlayer(targetID);

        const msgEmbed = new Discord.MessageEmbed()
            .setColor('#008000')
            .addField("Welcome to the game nerd", ("Try not to kill any Liberals. You facist fuck."));
        message.channel.send(msgEmbed);
    },
};