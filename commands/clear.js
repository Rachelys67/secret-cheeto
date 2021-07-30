// JavaScript source code


const Discord = require("discord.js");
var db = require("../RachelSheetsIO.js");
async function deleteMessages(channel) {
    const fetched = await channel.messages.fetch({ limit: 99 });
    channel.bulkDelete(fetched);
}

module.exports = {
    name: 'clear',
    description: 'clears gamestate',
    async execute(message, args) {
        const discCommand = message.content;
        
        //const channel = client.channels.cache.find(channel => channel.name === "current-board");
        let channel = message.guild.channels.cache.find(
            channel => channel.name.toLowerCase() === "current-board"
        )
        //let channel = message.guild.channels.find('name', 'current-board');
        await deleteMessages(channel);
        //channel.send('test?');
        db.resetGame();
    },
};