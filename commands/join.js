const Discord = require("discord.js");
var db = require("../RachelSheetsIO.js");

function test() {
    db.exportAddPlayer("zaralys");
}
//test();

module.exports = {
    name: 'join',
    description: 'adds new player!',
    execute(message, args) {
        const discCommand = message.content;
        const targetID = message.author.id;;
        db.exportAddPlayer(targetID);

        const msgEmbed = new Discord.MessageEmbed()
            .setColor('#008000')
            .addField("Welcome to the game nerd", ("Try not to kill any Liberals. You facist fuck."));
        message.channel.send(msgEmbed);
    },
};